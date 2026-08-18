"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/services/api";
import toast from "react-hot-toast";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: string | number;
  customer_name: string;
  customer_email: string;
  created_at: string;
  total_amount: number;
  status: string;
  items?: OrderItem[];
};

const STATUS_MAP: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  shipped: "Enviada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await fetchWithAuth("/orders");
      setOrders(data);
    } catch (err) {
      toast.error("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id: string | number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const updated = await fetchWithAuth(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status: newStatus });
      toast.success(`Orden ${STATUS_MAP[newStatus] || newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("¿Seguro que deseas eliminar esta orden?")) return;
    try {
      await fetchWithAuth(`/orders/${id}`, { method: "DELETE" });
      setOrders(orders.filter(o => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
      toast.success("Orden eliminada");
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar");
    }
  };

  const loadDetails = async (order: Order) => {
    try {
      const data = await fetchWithAuth(`/orders/${order.id}`);
      setSelectedOrder({ ...order, items: data.items || [] });
    } catch {
      setSelectedOrder(order);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Órdenes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona y actualiza el estado de las órdenes</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <svg className="mx-auto w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium">No hay órdenes aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900 dark:text-white">
                    #{String(order.id).slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customer_name || "—"}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{order.customer_email || ""}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {Object.entries(STATUS_MAP).map(([val, label]) => (
                        <option key={val} value={val} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center gap-3">
                      {/* Ver detalles */}
                      <button
                        onClick={() => loadDetails(order)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium underline"
                        title="Ver detalles"
                      >
                        Ver
                      </button>
                      {/* Aprobar rápido */}
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "approved")}
                          disabled={updatingId === order.id}
                          className="px-2 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50"
                          title="Aprobar"
                        >
                          ✓ Aprobar
                        </button>
                      )}
                      {/* Eliminar */}
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Orden #{String(selectedOrder.id).slice(0, 8).toUpperCase()}
                </h2>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[selectedOrder.status] || ""}`}>
                  {STATUS_MAP[selectedOrder.status] || selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Cliente</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer_name || "—"}</p>
                  <p className="text-gray-500 dark:text-gray-400">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedOrder.created_at).toLocaleDateString("es-EC", { dateStyle: "long" })}
                  </p>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Productos</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cant.</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedOrder.items.map((item, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{item.name}</td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">${Number(item.unit_price).toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.quantity}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">${(item.unit_price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  Total: <span className="text-blue-600">${Number(selectedOrder.total_amount).toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80 rounded-b-2xl">
              <div className="flex gap-2">
                {selectedOrder.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "approved")}
                      className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      ✓ Aprobar
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "cancelled")}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      ✗ Cancelar
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
