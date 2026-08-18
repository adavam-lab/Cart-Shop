"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { HiChevronDown, HiChevronUp, HiShoppingBag } from 'react-icons/hi';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image_url?: string;
}

interface Order {
  id: number;
  total_amount: string;
  discount: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, 'warning' | 'success' | 'info' | 'failure' | 'gray'> = {
  pending:   'warning',
  approved:  'info',
  shipped:   'info',
  completed: 'success',
  cancelled: 'failure',
};

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  approved:  'Aprobado',
  shipped:   'Enviado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      try {
        const data = await fetchWithAuth('/orders/my');
        setOrders(data);
        // Auto-open the first order
        if (data.length > 0) setOpenId(data[0].id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const toggle = (id: number) => setOpenId(prev => (prev === id ? null : id));

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-2xl border border-dashed border-orange-200 dark:border-orange-800 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-orange-900 dark:text-orange-400">Autenticación Requerida</h2>
          <p className="text-orange-700 dark:text-orange-300 mb-6">Por favor inicia sesión para ver tu historial de órdenes.</p>
          <Link href="/login" className="text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 w-full block text-center">
            Ir al Inicio de Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner aria-label="Cargando órdenes" size="xl" />
        <p className="mt-4 text-gray-500 font-medium">Cargando tus órdenes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
        <HiShoppingBag className="w-8 h-8 text-blue-600" />
        Mis Órdenes
      </h1>

      {orders.length === 0 ? (
        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-blue-800 dark:text-blue-400 font-semibold text-lg">Aún no has realizado ninguna orden.</p>
          <Link href="/products" className="text-blue-600 hover:underline dark:text-blue-400 mt-2 inline-block">
            Empieza a comprar ahora →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isOpen = openId === order.id;
            const statusColor = STATUS_COLORS[order.status] ?? 'gray';
            const statusLabel = STATUS_LABELS[order.status] ?? order.status;
            const discount = parseFloat(order.discount ?? '0');

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
              >
                {/* ── Cabecera clickeable ── */}
                <button
                  onClick={() => toggle(order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <HiShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Orden #{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('es-MX', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })}
                        {' · '}
                        {new Date(order.created_at).toLocaleTimeString('es-MX', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-extrabold text-lg text-gray-900 dark:text-white">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </p>
                      {discount > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Descuento: -${discount.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Badge color={statusColor} className="px-2 py-1 text-xs font-semibold">
                      {statusLabel}
                    </Badge>
                    {isOpen
                      ? <HiChevronUp className="w-5 h-5 text-gray-400" />
                      : <HiChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </button>

                {/* ── Lista desplegable de artículos ── */}
                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-5 pb-5 pt-4 animate-fade-in">
                    {/* Total en móvil */}
                    <div className="sm:hidden mb-3 flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>

                    <h6 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Artículos ({order.items?.length ?? 0})
                    </h6>

                    {!order.items || order.items.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Sin detalle de artículos.</p>
                    ) : (
                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                          >
                            {/* Imagen */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600 shrink-0">
                              {item.image_url
                                ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                              }
                            </div>

                            {/* Nombre */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                ${parseFloat(item.price).toFixed(2)} × {item.quantity} unid.
                              </p>
                            </div>

                            {/* Subtotal */}
                            <span className="font-bold text-sm text-gray-900 dark:text-white shrink-0">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}

                        {/* Resumen de totales */}
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex flex-col gap-1 text-sm">
                          {discount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400">
                              <span>Descuento aplicado</span>
                              <span>-${discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-extrabold text-base text-gray-900 dark:text-white">
                            <span>Total pagado</span>
                            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
