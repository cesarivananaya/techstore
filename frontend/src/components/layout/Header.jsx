import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiZap, FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi';
import { useAuthStore, useCartStore } from '../../store';
import { formatPrice, CATEGORIAS } from '../../utils';
import { CartSidebar } from '../cart/CartSidebar';
import { Badge } from '../common';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { itemCount, toggleCart } = useCartStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* Barra superior */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-xs text-white/90">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>📞 +52 33 1234 5678 | ✉️ hola@techstore.com</span>
          <span>🔒 Pago seguro · Garantía 2 años · Envío gratis +$999</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <FiZap className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent leading-none">TechStore</p>
                <p className="text-[10px] text-gray-500 leading-none">Electrónica Premium</p>
              </div>
            </Link>

            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
              <FiSearch className="text-gray-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos, marcas..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
              />
              <button type="submit" className="bg-violet-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-violet-500 transition-colors">
                Buscar
              </button>
            </form>

            {/* Acciones */}
            <div className="ml-auto flex items-center gap-2">
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-yellow-500 hover:text-yellow-400 hover:bg-white/5 transition-all font-semibold" title="Panel de Administración">
                      <FiPackage size={18} />
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <FiUser size={18} />
                    <span>{user.nombre.split(' ')[0]}</span>
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <FiPackage size={18} />
                  </Link>
                  <button onClick={logout} className="flex items-center px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 transition-all">
                    <FiLogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Entrar</Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors">Registro</Link>
                </div>
              )}

              <button
                onClick={toggleCart}
                className="relative flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all"
              >
                <FiShoppingCart size={18} />
                <span className="hidden sm:inline">Carrito</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav categorías */}
        <nav className="hidden md:block border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto">
              <Link to="/shop" className="px-4 py-3 text-sm text-gray-400 hover:text-white hover:border-b-2 hover:border-violet-500 transition-all whitespace-nowrap">
                Todos los Productos
              </Link>
              {CATEGORIAS.map((c) => (
                <Link
                  key={c.id}
                  to={`/shop?categoria=${c.id}`}
                  className="px-4 py-3 text-sm text-gray-400 hover:text-white hover:border-b-2 hover:border-violet-500 transition-all whitespace-nowrap"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Menú mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 px-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2">
              <FiSearch className="text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500" />
            </form>
            {CATEGORIAS.map((c) => (
              <Link key={c.id} to={`/shop?categoria=${c.id}`} onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-1">{c.label}</Link>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-400 hover:text-yellow-300 py-1 font-semibold">Admin Panel</Link>
                )}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-1">Mi Perfil</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-1">Mis Pedidos</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-sm text-red-400 text-left py-1">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-1">Iniciar Sesión</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-violet-400 hover:text-violet-300 py-1">Crear Cuenta</Link>
              </>
            )}
          </div>
        )}
      </header>

      <CartSidebar />
    </>
  );
}
