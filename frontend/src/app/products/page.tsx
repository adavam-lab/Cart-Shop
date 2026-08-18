"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { fetchWithAuth } from '../../services/api';
import { Card, CardContent, CardFooter, Button, Chip, Spinner } from '@heroui/react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' });

  const loadProducts = async () => {
    try {
      const data = await fetchWithAuth('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      };

      if (editingId) {
        await fetchWithAuth(`/products/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await fetchWithAuth('/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      
      setShowForm(false);
      setEditingId(null);
      setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
      loadProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock.toString(),
      imageUrl: product.image_url || ''
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
        loadProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center">
      <Spinner size="lg" aria-label="Loading products" />
      <p className="mt-4 text-gray-500">Loading products...</p>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Our Products</h1>
        {isAdmin && (
          <Button variant={showForm ? "outline" : "secondary"} onPress={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
          }}>
            {showForm ? 'Cancel' : 'Add New Product'}
          </Button>
        )}
      </div>

      {isAdmin && showForm && (
        <Card className="mb-8 max-w-2xl mx-auto" >
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Create Product'}</h2>
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Name" className="border p-2 rounded bg-gray-50" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                <input required type="number" step="0.01" placeholder="Price" className="border p-2 rounded bg-gray-50" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                <input required type="number" placeholder="Stock" className="border p-2 rounded bg-gray-50" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                <input placeholder="Image URL" className="border p-2 rounded bg-gray-50" value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} />
              </div>
              <textarea required placeholder="Description" className="border p-2 rounded bg-gray-50" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              <Button type="submit" variant="primary" className="mt-2">{editingId ? 'Update Product' : 'Save Product'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col h-full border-none" >
            <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 overflow-hidden relative">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
              ) : (
                <span>No Image</span>
              )}
            </div>
            <CardContent className="px-4 py-3 flex-1 flex flex-col">
              <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                {product.name}
              </h5>
              <p className="font-normal text-gray-500 dark:text-gray-400 text-sm flex-1 line-clamp-2 mt-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-gray-900 dark:text-white">${parseFloat(product.price).toFixed(2)}</span>
                {product.stock > 0 ? (
                  <Chip variant="soft" className="bg-green-100 text-green-800">{product.stock} in stock</Chip>
                ) : (
                  <Chip variant="soft" className="bg-red-100 text-red-800">Out of Stock</Chip>
                )}
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-2">
              <Button 
                variant="primary"
                className="w-full font-semibold"
                isDisabled={product.stock <= 0}
                onPress={() => addToCart({
                  productId: product.id,
                  name: product.name,
                  price: parseFloat(product.price),
                  quantity: 1
                })}
              >
                Add to cart
              </Button>
              {isAdmin && (
                <div className="flex gap-2 w-full mt-2">
                  <Button variant="outline" className="flex-1" onPress={() => handleEdit(product)}>Edit</Button>
                  <Button variant="danger" className="flex-1" onPress={() => handleDelete(product.id)}>Delete</Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
}
