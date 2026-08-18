import React, { useState } from 'react';
import { Table, Button, Modal, Label, TextInput, Select } from 'flowbite-react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Juan Perez', total: 1250.00, status: 'Completada', date: '2023-10-24' },
    { id: 'ORD-002', customer: 'Maria Garcia', total: 85.50, status: 'Pendiente', date: '2023-10-25' },
    { id: 'ORD-003', customer: 'Carlos Lopez', total: 340.00, status: 'Enviada', date: '2023-10-25' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [formData, setFormData] = useState({ customer: '', total: '', status: 'Pendiente', date: new Date().toISOString().split('T')[0] });

  const handleOpenModal = (order = null) => {
    if (order) {
      setCurrentOrder(order);
      setFormData(order);
    } else {
      setCurrentOrder(null);
      setFormData({ customer: '', total: '', status: 'Pendiente', date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentOrder) {
      setOrders(orders.map(o => o.id === currentOrder.id ? { ...formData, id: currentOrder.id } : o));
    } else {
      setOrders([...orders, { ...formData, id: `ORD-00${orders.length + 1}` }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setOrders(orders.filter(o => o.id !== orderToDelete.id));
    setIsDeleteModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completada': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Enviada': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Órdenes</h1>
        <Button color="blue" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-5 w-5" />
          Nueva Orden
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>ID Orden</Table.HeadCell>
              <Table.HeadCell>Cliente</Table.HeadCell>
              <Table.HeadCell>Fecha</Table.HeadCell>
              <Table.HeadCell>Total</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Acciones</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orders.map((order) => (
                <Table.Row key={order.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.id}
                  </Table.Cell>
                  <Table.Cell>{order.customer}</Table.Cell>
                  <Table.Cell>{order.date}</Table.Cell>
                  <Table.Cell>${order.total}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(order)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => { setOrderToDelete(order); setIsDeleteModalOpen(true); }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>{currentOrder ? 'Editar Orden' : 'Crear Orden'}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="customer" value="Nombre del Cliente" /></div>
              <TextInput id="customer" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block"><Label htmlFor="total" value="Total ($)" /></div>
                <TextInput id="total" type="number" value={formData.total} onChange={(e) => setFormData({...formData, total: Number(e.target.value)})} required />
              </div>
              <div>
                <div className="mb-2 block"><Label htmlFor="date" value="Fecha" /></div>
                <TextInput id="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="status" value="Estado" /></div>
              <Select id="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required>
                <option>Pendiente</option>
                <option>Enviada</option>
                <option>Completada</option>
                <option>Cancelada</option>
              </Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleSave}>Guardar</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={isDeleteModalOpen} size="md" popup onClose={() => setIsDeleteModalOpen(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <Trash2 className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro que deseas eliminar esta orden?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Sí, estoy seguro
              </Button>
              <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
