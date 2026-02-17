import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiLogOut } from 'react-icons/fi';
import { useAuth, useMyOrders } from '../hooks';
import { formatDate, formatPrice, ESTADOS_PEDIDO } from '../utils';
import { Button, Badge, Card } from '../components/common';

export default function Profile() {
    const { user, logout } = useAuth();
    const { data: orders } = useMyOrders({ limit: 5 });

    if (!user) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Link to="/login" className="text-violet-400">Inicia sesión</Link></div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Header */}
                <Card className="p-8 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-violet-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center">
                                <FiUser className="w-10 h-10 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black">{user.nombre}</h1>
                                <p className="text-gray-400">{user.email}</p>
                                <Badge color="violet" className="mt-2">{user.role}</Badge>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={logout}><FiLogOut /> Salir</Button>
                    </div>
                </Card>

                {/* Pedidos recientes */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2"><FiPackage /> Pedidos Recientes</h2>
                        <Link to="/orders" className="text-violet-400 text-sm hover:text-violet-300">Ver todos</Link>
                    </div>
                    {orders?.data?.length ? (
                        <div className="space-y-4">
                            {orders.data.map((o) => (
                                <Card key={o.id} className="p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white">{o.numeroPedido}</p>
                                            <p className="text-sm text-gray-400 mt-1">{formatDate(o.createdAt)} · {o.items?.length} producto(s)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-violet-400">{formatPrice(o.total)}</p>
                                            <Badge color={ESTADOS_PEDIDO[o.estado]?.color}>{ESTADOS_PEDIDO[o.estado]?.label}</Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center text-gray-500">
                            <FiPackage className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No tienes pedidos aún</p>
                            <Link to="/shop"><Button variant="outline" size="sm" className="mt-4">Explorar productos</Button></Link>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
