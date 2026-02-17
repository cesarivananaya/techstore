import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store';
import { formatPrice, calcDiscount } from '../../utils';
import { Badge } from '../common';

// ─── ProductCard ──────────────────────────────────────────────────────────────
export function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = calcDiscount(product.precioAnterior, product.precio);
  const img = product.imagenes?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative overflow-hidden aspect-square bg-gray-800">
        <img
          src={img || 'https://via.placeholder.com/400x400?text=Sin+imagen'}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.nuevo      && <Badge color="green">Nuevo</Badge>}
          {discount > 0       && <Badge color="red">-{discount}%</Badge>}
          {product.destacado  && <Badge color="violet">Destacado</Badge>}
        </div>

        {/* Overlay de acciones */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-violet-600 transition-colors"
          >
            <FiEye size={18} />
          </Link>
          <button
            onClick={() => addItem(product)}
            className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white hover:bg-violet-500 transition-colors"
          >
            <FiShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-violet-400 font-medium uppercase tracking-wide">
          {product.marca}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-white text-sm leading-snug hover:text-violet-300 transition-colors line-clamp-2">
            {product.nombre}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          <FiStar className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-medium">{Number(product.ratingPromedio).toFixed(1)}</span>
          <span className="text-gray-500">({product.ratingCantidad})</span>
        </div>

        {/* Precio */}
        <div className="flex items-end gap-2">
          <span className="text-xl font-black text-violet-400">{formatPrice(product.precio)}</span>
          {product.precioAnterior && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.precioAnterior)}</span>
          )}
        </div>

        {/* Stock */}
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-orange-400">⚡ Solo quedan {product.stock} unidades</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-400 font-medium">Agotado</p>
        )}

        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25"
        >
          {product.stock === 0 ? 'Sin stock' : 'Agregar al Carrito'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── ProductGrid ──────────────────────────────────────────────────────────────
export function ProductGrid({ products = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-white/5" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-white/5 rounded w-1/3" />
              <div className="h-4 bg-white/5 rounded" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
              <div className="h-8 bg-white/5 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        <FiShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
