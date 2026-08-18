import React, { useState, useEffect } from 'react';
import { Trash2, Package } from 'lucide-react';
import { fetchWithAuth } from '../services/api';

const STATUS_MAP = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  shipped: 'Enviada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth('/orders');
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await fetchWithAuth(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta orden?')) return;
    try {
      await fetchWithAuth(`/orders/${id}`, { method: 'DELETE' });
      setOrders(orders.filter(o => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const loadDetails = async (order) => {
    setSelectedOrder({ ...order, items: [] });
    setLoadingItems(true);
    try {
      const data = await fetchWithAuth(`/orders/${order.id}`);
      setSelectedOrder(prev => ({ ...prev, items: data.items || [] }));
    } catch (e) {
      console.error('Error loading order details:', e);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Órdenes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{orders.length} órdenes en total</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error} — <button onClick={fetchOrders} className="underline">Reintentar</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No hay órdenes registradas</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{String(order.id).slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{order.customer_name || '—'}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString('es-EC')}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer border-0 focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {Object.entries(STATUS_MAP).map(([val, label]) => (
                          <option key={val} value={val} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => loadDetails(order)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs underline">Ver</button>
                        {order.status === 'pending' && (
                          <button onClick={() => handleStatusChange(order.id, 'approved')} disabled={updatingId === order.id}
                            className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50">
                            ✓ Aprobar
                          </button>
                        )}
                        <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-800 dark:text-red-400" title="Eliminar">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orden #{String(selectedOrder.id).slice(0,8).toUpperCase()}</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[selectedOrder.status] || ''}`}>
                  {STATUS_MAP[selectedOrder.status] || selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
              {/* Info cliente */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Cliente</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.customer_name || '—'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Fecha</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{new Date(selectedOrder.created_at).toLocaleDateString('es-EC', { dateStyle: 'long' })}</p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Package size={16} className="text-blue-500" />
                  Productos comprados
                </h3>

                {loadingItems ? (
                  <div className="flex items-center justify-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Cargando productos...</span>
                  </div>
                ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Producto</th>
                          <th className="px-4 py-3 text-right">Precio</th>
                          <th className="px-4 py-3 text-center">Cant.</th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {selectedOrder.items.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600 shrink-0" onError={e => e.target.style.display='none'} />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                    <Package size={14} className="text-gray-400" />
                                  </div>
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">${Number(item.unit_price).toFixed(2)}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                                x{item.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">${(Number(item.unit_price) * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 dark:bg-gray-800/80 border-t-2 border-gray-200 dark:border-gray-600">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Total de la Orden:</td>
                          <td className="px-4 py-3 text-right text-lg font-bold text-blue-600 dark:text-blue-400">${Number(selectedOrder.total_amount).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-gray-400">
                    <Package size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">No se encontraron productos en esta orden</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0 bg-gray-50 dark:bg-gray-800/80 rounded-b-2xl">
              <div className="flex gap-2">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusChange(selectedOrder.id, 'approved')} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">✓ Aprobar</button>
                    <button onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">✗ Cancelar</button>
                  </>
                )}
              </div>
              <button onClick={() => setSelectedOrder(null)} className="px-5 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
