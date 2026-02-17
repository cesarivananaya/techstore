import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services';
import { toast } from 'react-toastify';

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoading:    false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authService.login({ email, password });
          const { user, accessToken, refreshToken } = data.data;
          localStorage.setItem('accessToken',  accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
          toast.success(`Bienvenido, ${user.nombre.split(' ')[0]}`);
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      register: async (form) => {
        set({ isLoading: true });
        try {
          const { data } = await authService.register(form);
          const { user, accessToken, refreshToken } = data.data;
          localStorage.setItem('accessToken',  accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
          toast.success('Cuenta creada exitosamente');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      logout: async () => {
        try { await authService.logout(); } catch { /* ignorar */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null });
        toast.info('Sesión cerrada');
      },

      refreshUser: async () => {
        try {
          const { data } = await authService.getMe();
          set({ user: data.data });
        } catch { get().logout(); }
      },

      isAuthenticated: () => !!get().user,
      isAdmin:         () => get().user?.role === 'admin',
    }),
    {
      name:    'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }),
    }
  )
);

// ─── Cart Store ───────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items:   [],
      isOpen:  false,

      // Agregar o incrementar
      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, cantidad: Math.min(i.cantidad + qty, product.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, cantidad: qty }] };
        });
        toast.success('Producto añadido al carrito');
      },

      // Actualizar cantidad
      updateItem: (id, cantidad) => {
        if (cantidad < 1) return get().removeItem(id);
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, cantidad } : i)),
        }));
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        toast.info('Producto eliminado del carrito');
      },

      clearCart: () => set({ items: [] }),

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart:() => set((s) => ({ isOpen: !s.isOpen })),

      // Calculados
      get subtotal() { return get().items.reduce((s, i) => s + Number(i.precio) * i.cantidad, 0); },
      get itemCount(){ return get().items.reduce((s, i) => s + i.cantidad, 0); },
      get shipping() { return get().items.reduce((s,i)=>s+Number(i.precio)*i.cantidad,0) >= 999 ? 0 : 50; },
      get total()    { const s=get().items.reduce((a,i)=>a+Number(i.precio)*i.cantidad,0); return s+(s>=999?0:50); },
    }),
    {
      name:    'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);
