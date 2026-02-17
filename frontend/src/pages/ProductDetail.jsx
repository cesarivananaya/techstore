import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiInfo } from 'react-icons/fi';
import { useProduct } from '../hooks';
import { formatPrice } from '../utils';
import { Button, Badge, Spinner } from '../components/common';
import { toast } from 'react-toastify';

export default function ProductDetail() {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(id);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Spinner size={12} />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
                <h2 className="text-3xl font-bold text-red-400">Error</h2>
                <p className="text-gray-400">No pudimos cargar el producto.</p>
                <Link to="/shop">
                    <Button variant="outline">Volver a la tienda</Button>
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        // TODO: Implementar lógica real con CartContext
        toast.success(`Añadido ${quantity} x ${product.nombre} al carrito`);
    };

    const images = product.imagenes && product.imagenes.length > 0
        ? product.imagenes
        : [{ url: 'https://via.placeholder.com/600x600?text=No+Image', alt: 'No image' }];

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link to="/shop" className="inline-flex items-center text-gray-400 hover:text-white transition-colors gap-2 text-sm font-medium">
                        <FiArrowLeft /> Regresar a la tienda
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Galería de Imágenes */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden relative group">
                            <img
                                src={images[selectedImage].url}
                                alt={images[selectedImage].alt}
                                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                            />
                            {product.nuevo && (
                                <div className="absolute top-4 left-4">
                                    <Badge color="green">NUEVO</Badge>
                                </div>
                            )}
                        </div>

                        {/* Miniaturas */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded-xl border flex-shrink-0 overflow-hidden transition-all ${selectedImage === idx ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del Producto */}
                    <div>
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge color="blue">{product.marca}</Badge>
                                {product.stock > 0 ? (
                                    <span className="text-green-400 text-xs font-bold flex items-center gap-1"><FiCheck /> En Stock</span>
                                ) : (
                                    <span className="text-red-400 text-xs font-bold">Agotado</span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{product.nombre}</h1>

                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-4xl font-bold text-violet-400">{formatPrice(product.precio)}</span>
                                {product.precioAnterior && (
                                    <span className="text-xl text-gray-500 line-through mb-1">{formatPrice(product.precioAnterior)}</span>
                                )}
                            </div>

                            <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-4 border-violet-500/20 pl-4">
                                {product.descripcion}
                            </p>
                        </div>

                        {/* Selector de Cantidad y Botón */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-8">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex items-center bg-gray-900 rounded-xl border border-white/10 p-1">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors font-bold text-xl"
                                    >−</button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors font-bold text-xl"
                                    >+</button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="w-full h-12 text-lg flex items-center justify-center gap-2"
                                >
                                    <FiShoppingCart /> {product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-3">Envío calculado en el checkout</p>
                        </div>

                        {/* Especificaciones Técnicas */}
                        {product.especificaciones && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                                    <FiInfo className="text-violet-400" /> Especificaciones
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(product.especificaciones).map(([key, val]) => (
                                        <div key={key} className="bg-white/[0.02] p-3 rounded-lg flex flex-col">
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 ">{key}</span>
                                            <span className="text-white font-medium capitalize">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
