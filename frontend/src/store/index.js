import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services';
import { toast } from 'react-toastify';

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authService.login({ email, password });
          const { user, accessToken, refreshToken } = data.data;
          localStorage.setItem('accessToken', accessToken);
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
          localStorage.setItem('accessToken', accessToken);
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
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }),
    }
  )
);

// ─── Cart Store ───────────────────────────────────────────────────────────────
// ─── Cart Store ───────────────────────────────────────────────────────────────
const calcCartValues = (items) => {
  const subtotal = items.reduce((s, i) => s + Number(i.precio) * i.cantidad, 0);
  const itemCount = items.reduce((s, i) => s + i.cantidad, 0);
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;
  return { subtotal, itemCount, shipping, total };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      subtotal: 0,
      itemCount: 0,
      shipping: 0,
      total: 0,

      // Agregar o incrementar
      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          let newItems;

          if (existing) {
            newItems = state.items.map((i) =>
              i.id === product.id
                ? { ...i, cantidad: Math.min(i.cantidad + qty, product.stock || 99) }
                : i
            );
          } else {
            newItems = [...state.items, { ...product, cantidad: qty }];
          }

          return { items: newItems, ...calcCartValues(newItems), isOpen: true };
        });
        toast.success('Producto añadido al carrito');
      },

      // Actualizar cantidad
      updateItem: (id, cantidad) => {
        const state = get();
        if (cantidad < 1) return state.removeItem(id);

        const newItems = state.items.map((i) => (i.id === id ? { ...i, cantidad } : i));
        set({ items: newItems, ...calcCartValues(newItems) });
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({ items: newItems, ...calcCartValues(newItems) });
        toast.info('Producto eliminado del carrito');
      },

      clearCart: () => set({ items: [], subtotal: 0, itemCount: 0, shipping: 0, total: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        subtotal: s.subtotal,
        itemCount: s.itemCount,
        shipping: s.shipping,
        total: s.total
      }),
    }
  )
);
