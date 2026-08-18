"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge, Card, Spinner, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  items?: OrderItem[]; // Might be populated by the API
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      try {
        const data = await fetchWithAuth('/orders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-2xl border border-dashed border-orange-200 dark:border-orange-800 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-orange-900 dark:text-orange-400">Autenticación Requerida</h2>
          <p className="text-orange-700 dark:text-orange-300 mb-6">Por favor inicia sesión para ver tu historial de órdenes.</p>
          <Link href="/login" className="text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 w-full block">
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white">Tus Órdenes</h1>
      
      {orders.length === 0 ? (
        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg p-6 text-center">
          <p className="text-blue-800 dark:text-blue-400 font-medium">Aún no has realizado ninguna orden.</p>
          <Link href="/products" className="text-blue-600 hover:underline dark:text-blue-500 mt-2 inline-block">
            Empieza a comprar ahora
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <Card key={order.id} className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Orden #{order.id}
                  </h5>
                  <p className="font-normal text-gray-500 dark:text-gray-400 mt-1">
                    Realizada el {new Date(order.created_at).toLocaleDateString()} a las {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                  <p className="font-extrabold text-2xl text-gray-900 dark:text-white mb-2">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </p>
                  <Badge 
                    color={order.status === 'pending' ? 'warning' : 'success'} 
                    size="sm"
                    className="px-3 py-1"
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Order Items Table */}
              {order.items && order.items.length > 0 ? (
                <div className="mt-4 border-t border-gray-100 dark:border-gray-600 pt-4 overflow-x-auto">
                  <h6 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Artículos en esta orden</h6>
                  <Table hoverable>
                    <TableHead>
                      <TableHeadCell>Producto</TableHeadCell>
                      <TableHeadCell>Precio</TableHeadCell>
                      <TableHeadCell>Cantidad</TableHeadCell>
                      <TableHeadCell>Subtotal</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                      {order.items.map(item => (
                        <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </TableCell>
                          <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="font-semibold text-gray-900 dark:text-white">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="mt-4 border-t border-gray-100 dark:border-gray-600 pt-4 text-sm text-gray-500 italic">
                  Los detalles sobre artículos específicos no están disponibles para esta orden.
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
