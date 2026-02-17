import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Spinner } from './components/common';
import { useAuthStore } from './store';

// Lazy-load pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Admin = lazy(() => import('./pages/Admin'));

// ─── Query Client ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Route Guards ─────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function GuestOnly({ children }) {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/" replace />;
  return children;
}

// ─── Layout wrapper ───────────────────────────────────────────────────────────
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// ─── Fallback de carga ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Spinner size={12} />
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const refreshUser = useAuthStore((s) => s.refreshUser);

  // Rehidratar usuario al cargar
  useEffect(() => { refreshUser(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/shop" element={<Layout><Shop /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />

            {/* Auth (solo para no autenticados) */}
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

            {/* Protegidas */}
            <Route path="/profile" element={<RequireAuth><Layout><Profile /></Layout></RequireAuth>} />
            <Route path="/orders" element={<RequireAuth><Layout><PageLoader /></Layout></RequireAuth>} />
            <Route path="/orders/:id/confirmation" element={<RequireAuth><Layout><PageLoader /></Layout></RequireAuth>} />
            <Route path="/checkout" element={<RequireAuth><Layout><PageLoader /></Layout></RequireAuth>} />

            {/* Admin */}
            <Route path="/admin/*" element={<RequireAdmin><Layout><Admin /></Layout></RequireAdmin>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
                <h1 className="text-8xl font-black text-violet-400">404</h1>
                <p className="text-gray-400 text-xl">Página no encontrada</p>
                <a href="/" className="bg-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-violet-500 transition-colors">Ir al inicio</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        theme="dark"
        toastClassName="!bg-gray-800 !border !border-white/10 !rounded-xl"
      />
    </QueryClientProvider>
  );
}
