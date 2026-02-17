import { useMyOrders } from '../hooks';
import { Spinner, Card, Badge, EmptyState, Button } from '../components/common';
import { formatPrice, formatDate } from '../utils';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiArrowRight } from 'react-icons/fi';

const statusConfig = {
    pendiente: { icon: FiClock, color: 'yellow' },
    procesando: { icon: FiPackage, color: 'blue' },
    enviado: { icon: FiTruck, color: 'purple' },
    entregado: { icon: FiCheck, color: 'green' },
    cancelado: { icon: FiX, color: 'red' },
};

export default function Orders() {
    const { data: orders, isLoading } = useMyOrders();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Spinner size={12} />
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
                <EmptyState
                    icon={FiPackage}
                    title="No tienes pedidos aún"
                    desc="Explora nuestra tienda y encuentra los mejores productos tecnológicos."
                    action={
                        <Link to="/shop">
                            <Button>Ir a la Tienda</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
                    <FiPackage className="text-violet-400" /> Mis Pedidos
                </h1>

                <div className="space-y-6">
                    {orders.map((order) => {
                        const StatusIcon = statusConfig[order.estado]?.icon || FiClock;

                        return (
                            <Card key={order.id} className="p-6 transition-all hover:border-violet-500/30 group">
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-lg font-bold">Pedido #{order.id.slice(0, 8)}</span>
                                            <Badge color={statusConfig[order.estado]?.color || 'gray'} className="flex items-center gap-1">
                                                <StatusIcon size={12} /> {order.estado}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-400 text-sm">Realizado el {formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Total</p>
                                        <p className="text-2xl font-bold text-white">{formatPrice(order.total)}</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {order.items?.slice(0, 4).map((item, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden" title={item.nombre}>
                                                    {item.imagen ? (
                                                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FiPackage className="text-gray-500" />
                                                    )}
                                                </div>
                                            ))}
                                            {order.items?.length > 4 && (
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <Link to={`/orders/${order.id}`}>
                                            <Button variant="secondary" size="sm" className="w-full sm:w-auto group-hover:bg-white/10">
                                                Ver Detalles <FiArrowRight />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
