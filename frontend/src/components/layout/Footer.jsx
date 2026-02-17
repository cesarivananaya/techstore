import { Link } from 'react-router-dom';
import { FiZap, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { CATEGORIAS } from '../../utils';

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 text-gray-400 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Marca */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <FiZap className="w-7 h-7 text-violet-400" />
              <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">TechStore</span>
            </Link>
            <p className="text-sm leading-relaxed">Tu destino para la mejor tecnología premium con garantía, soporte y los mejores precios.</p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-3">
            <h4 className="text-white font-bold">Productos</h4>
            {CATEGORIAS.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/shop?categoria=${c.id}`} className="block text-sm hover:text-violet-400 transition-colors">{c.label}</Link>
            ))}
          </div>

          {/* Servicio */}
          <div className="space-y-3">
            <h4 className="text-white font-bold">Servicio al Cliente</h4>
            {['Envíos y Entregas', 'Devoluciones', 'Garantías', 'Preguntas Frecuentes', 'Rastrear Pedido'].map((t) => (
              <a key={t} href="#" className="block text-sm hover:text-violet-400 transition-colors">{t}</a>
            ))}
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <h4 className="text-white font-bold">Contacto</h4>
            <div className="flex items-start gap-2 text-sm"><FiMapPin className="shrink-0 mt-0.5 text-violet-400" /><span>Av. Tecnología 123, Guadalajara, MX</span></div>
            <div className="flex items-center gap-2 text-sm"><FiPhone className="text-violet-400" /><span>+52 33 1234 5678</span></div>
            <div className="flex items-center gap-2 text-sm"><FiMail className="text-violet-400" /><span>hola@techstore.com</span></div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} TechStore. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-violet-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
