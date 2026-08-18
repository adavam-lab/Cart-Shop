import React, { useState } from 'react';
import { Table, Button, Modal, Label, TextInput, Select } from 'flowbite-react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([
    { id: 1, name: 'MacBook Pro 16"', price: 2499, stock: 15, category: 'Laptops' },
    { id: 2, name: 'iPhone 15 Pro', price: 999, stock: 42, category: 'Smartphones' },
    { id: 3, name: 'AirPods Pro 2', price: 249, stock: 105, category: 'Accesorios' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'Laptops' });

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData(product);
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', price: '', stock: '', category: 'Laptops' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? { ...formData, id: currentProduct.id } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
        <Button color="blue" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Nombre del Producto</Table.HeadCell>
              <Table.HeadCell>Categoría</Table.HeadCell>
              <Table.HeadCell>Precio</Table.HeadCell>
              <Table.HeadCell>Stock</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Acciones</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {products.map((product) => (
                <Table.Row key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>${product.price}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 20 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {product.stock} unds.
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => { setProductToDelete(product); setIsDeleteModalOpen(true); }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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
        <Modal.Header>{currentProduct ? 'Editar Producto' : 'Crear Producto'}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="name" value="Nombre del Producto" /></div>
              <TextInput id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block"><Label htmlFor="price" value="Precio ($)" /></div>
                <TextInput id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
              </div>
              <div>
                <div className="mb-2 block"><Label htmlFor="stock" value="Stock" /></div>
                <TextInput id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} required />
              </div>
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="category" value="Categoría" /></div>
              <Select id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                <option>Laptops</option>
                <option>Smartphones</option>
                <option>Tablets</option>
                <option>Accesorios</option>
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
              ¿Estás seguro que deseas eliminar este producto?
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
