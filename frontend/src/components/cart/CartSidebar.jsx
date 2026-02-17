// ─── CartSidebar ──────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '../../store';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../../utils';
import { Button } from '../common';

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateItem, total, subtotal, shipping, itemCount } = useCartStore();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            Tu Carrito {itemCount > 0 && <span className="text-violet-400">({itemCount})</span>}
          </h2>
          <button onClick={closeCart} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <FiX size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <FiShoppingCart className="w-16 h-16 text-gray-700" />
              <p className="text-gray-400 font-medium">Tu carrito está vacío</p>
              <Button variant="outline" size="sm" onClick={closeCart} as={Link} to="/shop">
                Explorar productos
              </Button>
            </div>
          ) : items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white/[0.03] rounded-2xl p-3 border border-white/5">
              <img
                src={item.imagenes?.[0]?.url}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.nombre}</p>
                <p className="text-violet-400 font-bold text-base mt-1">{formatPrice(item.precio)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateItem(item.id, item.cantidad - 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <FiMinus size={12} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.cantidad}</span>
                  <button onClick={() => updateItem(item.id, item.cantidad + 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <FiPlus size={12} />
                  </button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)}
                className="self-start p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10 space-y-4">
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-sm text-violet-300">
                Añade <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> más para envío gratis
              </div>
            )}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Envío</span><span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white'}>{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2 mt-2">
                <span>Total</span>
                <span className="text-violet-400">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" onClick={closeCart}>
              <Button variant="primary" size="lg" className="w-full">
                Proceder al Pago
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
