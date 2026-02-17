// ─── Formatters ───────────────────────────────────────────────────────────────
export const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(price);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));

export const formatRelative = (date) => {
  const diff  = Date.now() - new Date(date).getTime();
  const days  = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7)  return `Hace ${days} días`;
  return formatDate(date);
};

export const calcDiscount = (original, current) =>
  original && current ? Math.round(((original - current) / original) * 100) : 0;

export const truncate = (text, max = 80) =>
  text?.length > max ? `${text.slice(0, max)}…` : text;

// ─── Constantes ───────────────────────────────────────────────────────────────
export const CATEGORIAS = [
  { id: 'smartphones', label: 'Smartphones'  },
  { id: 'laptops',     label: 'Laptops'       },
  { id: 'tablets',     label: 'Tablets'       },
  { id: 'audio',       label: 'Audio'         },
  { id: 'wearables',   label: 'Wearables'     },
  { id: 'camaras',     label: 'Cámaras'       },
  { id: 'accesorios',  label: 'Accesorios'    },
  { id: 'hogar',       label: 'Hogar'         },
  { id: 'gaming',      label: 'Gaming'        },
];

export const ESTADOS_PEDIDO = {
  pendiente:    { label: 'Pendiente',    color: 'yellow' },
  procesando:   { label: 'Procesando',   color: 'blue'   },
  enviado:      { label: 'Enviado',      color: 'purple' },
  entregado:    { label: 'Entregado',    color: 'green'  },
  cancelado:    { label: 'Cancelado',    color: 'red'    },
  reembolsado:  { label: 'Reembolsado',  color: 'gray'   },
};

export const SORT_OPTIONS = [
  { value: 'createdAt:DESC', label: 'Más recientes' },
  { value: 'precio:ASC',     label: 'Precio: menor a mayor' },
  { value: 'precio:DESC',    label: 'Precio: mayor a menor' },
  { value: 'nombre:ASC',     label: 'Nombre A-Z' },
  { value: 'ratingPromedio:DESC', label: 'Mejor valorados' },
  { value: 'vendidos:DESC',  label: 'Más vendidos' },
];

export const FREE_SHIPPING_THRESHOLD = 999;
