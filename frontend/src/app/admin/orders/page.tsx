"use client";

import { useState } from "react";
import OrderDetailsModal, { Order } from "@/components/admin/OrderDetailsModal";

// Datos de prueba (Mocks)
const initialOrders: Order[] = [
  { 
    id: "ord_1a2b3c", 
    customerName: "Juan Pérez", 
    customerEmail: "juan@ejemplo.com", 
    date: "2023-10-25T10:00:00Z", 
    total: 75.98, 
    status: "Pendiente",
    items: [
      { id: "i1", productName: "Camiseta Básica", quantity: 1, price: 15.99 },
      { id: "i2", productName: "Zapatillas Runner", quantity: 1, price: 59.99 }
    ]
  },
  { 
    id: "ord_9f8e7d", 
    customerName: "Ana Gómez", 
    customerEmail: "ana@ejemplo.com", 
    date: "2023-10-24T14:30:00Z", 
    total: 129.99, 
    status: "Aprobada",
    items: [
      { id: "i3", productName: "Reloj Inteligente", quantity: 1, price: 129.99 }
    ]
  },
  { 
    id: "ord_4x5y6z", 
    customerName: "Luis Silva", 
    customerEmail: "luis@ejemplo.com", 
    date: "2023-10-20T09:15:00Z", 
    total: 47.97, 
    status: "Cancelada",
    items: [
      { id: "i1", productName: "Camiseta Básica", quantity: 3, price: 15.99 }
    ]
  }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "Aprobada" } : o));
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "Cancelada" } : o));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Órdenes</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Orden</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{order.id.toUpperCase().substring(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'Aprobada' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button 
                    onClick={() => handleViewClick(order)} 
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onApprove={handleApproveOrder}
        onCancel={handleCancelOrder}
      />
    </div>
  );
}
