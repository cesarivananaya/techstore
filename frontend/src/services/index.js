import api from './api';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  logout:         ()      => api.post('/auth/logout'),
  getMe:          ()      => api.get('/auth/me'),
  refreshToken:   (token) => api.post('/auth/refresh', { refreshToken: token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// ─── Productos ────────────────────────────────────────────────────────────────
export const productService = {
  getAll:         (params) => api.get('/products', { params }),
  getOne:         (id)     => api.get(`/products/${id}`),
  getBySlug:      (slug)   => api.get(`/products/slug/${slug}`),
  getCategoryStats:()      => api.get('/products/categories/stats'),
  create:         (data)   => api.post('/products', data),
  update:         (id, data) => api.put(`/products/${id}`, data),
  remove:         (id)     => api.delete(`/products/${id}`),
};

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export const orderService = {
  create:       (data)   => api.post('/orders', data),
  getMine:      (params) => api.get('/orders/me', { params }),
  getOne:       (id)     => api.get(`/orders/${id}`),
  getAll:       (params) => api.get('/orders', { params }),
  updateStatus: (id, estado, nota) => api.patch(`/orders/${id}/status`, { estado, nota }),
  markAsPaid:   (id, transaccionId) => api.patch(`/orders/${id}/pay`, { transaccionId }),
};

// ─── Usuarios ─────────────────────────────────────────────────────────────────
export const userService = {
  getProfile:     ()       => api.get('/users/profile'),
  updateProfile:  (data)   => api.put('/users/profile', data),
  updatePassword: (data)   => api.put('/users/password', data),
  getAllUsers:     ()       => api.get('/users'),
  toggleActive:   (id)     => api.patch(`/users/${id}/toggle`),
};
