import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProducts, useCategoryStats } from '../hooks';
import { ProductGrid } from '../components/product';
import { CATEGORIAS, formatPrice } from '../utils';

const FEATURES = [
  { icon: FiTruck,      title: 'Envío Gratis',     desc: 'En pedidos mayores a $999' },
  { icon: FiShield,     title: 'Pago Seguro',       desc: 'Encriptación SSL 256-bit' },
  { icon: FiRefreshCw,  title: 'Devoluciones',      desc: '30 días sin preguntas' },
  { icon: FiHeadphones, title: 'Soporte 24/7',      desc: 'Chat, email y teléfono' },
];

export default function Home() {
  const { data: featured, isLoading } = useProducts({ destacado: true, limit: 8 });

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-[#1a1040] to-gray-950 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7 }} className="space-y-6">
              <span className="inline-block bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full">
                🚀 Nueva Temporada 2024
              </span>
              <h1 className="text-5xl md:text-6xl font-black leading-[1.1]">
                La Mejor <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Tecnología</span> Premium
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Descubre la colección más completa de electrónica de alta gama. Smartphones, laptops, audio y más con hasta 40% de descuento.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/shop">
                  <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all">
                    Explorar Productos <FiArrowRight />
                  </motion.button>
                </Link>
                <Link to="/shop?destacado=true">
                  <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                    Ver Ofertas
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.2 }}>
              <motion.img
                src="https://images.unsplash.com/photo-1696446702183-cbd80756d537?w=700&q=80"
                alt="iPhone 15 Pro Max"
                className="w-full rounded-3xl shadow-2xl shadow-violet-500/20"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black text-center mb-12">
          Explora por <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Categoría</span>
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {CATEGORIAS.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/shop?categoria=${c.id}`}
                className="flex flex-col items-center gap-2 p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group text-center">
                <span className="text-2xl">
                  {{'smartphones':'📱','laptops':'💻','tablets':'📲','audio':'🎧','wearables':'⌚','camaras':'📷','accesorios':'🔌','hogar':'🏠','gaming':'🎮'}[c.id]}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-violet-300 transition-colors font-medium leading-tight">{c.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black">
              Productos <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Destacados</span>
            </h2>
            <Link to="/shop" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">
              Ver todos <FiArrowRight />
            </Link>
          </div>
          <ProductGrid products={featured?.data} loading={isLoading} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}
              className="flex flex-col items-center text-center gap-3 p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
