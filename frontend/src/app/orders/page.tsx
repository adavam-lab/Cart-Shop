"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, Chip, Spinner } from '@heroui/react';

interface Order {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
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
      <div className="max-w-lg mx-auto py-20">
        <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-4">
          Please login to view your orders.
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center">
      <Spinner size="lg" aria-label="Loading orders" />
      <p className="mt-4 text-gray-500">Loading orders...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} >
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Order #{order.id}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-2xl text-gray-900 dark:text-white mb-2">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                    <Chip color={order.status === 'pending' ? 'warning' : 'success'} size="sm" variant="soft">
                      {order.status.toUpperCase()}
                    </Chip>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
