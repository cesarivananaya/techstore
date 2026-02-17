import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, orderService } from '../services';
import { useAuthStore } from '../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// ─── useProducts ──────────────────────────────────────────────────────────────
export const useProducts = (params = {}) =>
  useQuery({
    queryKey: ['products', params],
    queryFn:  () => productService.getAll(params).then((r) => r.data),
    staleTime: 60_000,
    keepPreviousData: true,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id],
    queryFn:  () => productService.getOne(id).then((r) => r.data.data),
    enabled:  !!id,
  });

export const useCategoryStats = () =>
  useQuery({
    queryKey: ['categoryStats'],
    queryFn:  () => productService.getCategoryStats().then((r) => r.data.data),
    staleTime: 300_000,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => { qc.invalidateQueries(['products']); toast.success('Producto creado'); },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['products']); toast.success('Producto actualizado'); },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.remove,
    onSuccess: () => { qc.invalidateQueries(['products']); toast.success('Producto eliminado'); },
  });
};

// ─── useOrders ────────────────────────────────────────────────────────────────
export const useMyOrders = (params = {}) =>
  useQuery({
    queryKey: ['myOrders', params],
    queryFn:  () => orderService.getMine(params).then((r) => r.data),
    staleTime: 30_000,
  });

export const useOrder = (id) =>
  useQuery({
    queryKey: ['order', id],
    queryFn:  () => orderService.getOne(id).then((r) => r.data.data),
    enabled:  !!id,
  });

export const useAllOrders = (params = {}) =>
  useQuery({
    queryKey: ['allOrders', params],
    queryFn:  () => orderService.getAll(params).then((r) => r.data),
    staleTime: 30_000,
  });

export const useCreateOrder = () => {
  const qc       = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: orderService.create,
    onSuccess: (res) => {
      qc.invalidateQueries(['myOrders']);
      navigate(`/orders/${res.data.data.id}/confirmation`);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado, nota }) => orderService.updateStatus(id, estado, nota),
    onSuccess: () => { qc.invalidateQueries(['allOrders']); toast.success('Estado actualizado'); },
  });
};

// ─── useAuth ──────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const store    = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await store.logout();
    navigate('/');
  };

  return { ...store, logout: handleLogout };
};
