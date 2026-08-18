import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          fetchWithAuth('/users'),
          fetchWithAuth('/products'),
          fetchWithAuth('/orders'),
        ]);
        const revenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
          revenue,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: 'Usuarios Totales', value: stats.users, icon: Users, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Productos Activos', value: stats.products, icon: Package, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Órdenes Totales', value: stats.orders, icon: ShoppingCart, color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Ingresos Totales', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 text-white ${card.color} rounded-lg p-1 box-content`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
