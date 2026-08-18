import React, { useState } from 'react';
import { Table, Button, Modal, Label, TextInput, Select } from 'flowbite-react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Daniel Valencia', email: 'daniel@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Ana Gomez', email: 'ana@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Luis Martinez', email: 'luis@example.com', role: 'Editor', status: 'Inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '', role: 'User', status: 'Active' });

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData(user);
    } else {
      setCurrentUser(null);
      setFormData({ name: '', email: '', role: 'User', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentUser) {
      setUsers(users.map(u => u.id === currentUser.id ? { ...formData, id: currentUser.id } : u));
    } else {
      setUsers([...users, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <Button color="blue" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Acciones</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {user.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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
        <Modal.Header>{currentUser ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="name" value="Nombre Completo" /></div>
              <TextInput id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="email" value="Correo Electrónico" /></div>
              <TextInput id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="role" value="Rol" /></div>
              <Select id="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required>
                <option>Admin</option>
                <option>Editor</option>
                <option>User</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="status" value="Estado" /></div>
              <Select id="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required>
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
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
              ¿Estás seguro que deseas eliminar este usuario?
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
