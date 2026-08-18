"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { fetchWithAuth } from '../../services/api';
import { Button, Card, Spinner } from 'flowbite-react';
import { HiOutlineShoppingCart } from 'react-icons/hi';

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
  const { addToCart } = useCart();

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

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
      <Spinner aria-label="Cargando productos" size="xl" />
      <p className="mt-4 text-gray-500 font-medium">Cargando productos premium...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nuestra Colección Premium</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Descubre los mejores productos cuidadosamente seleccionados para ti.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col h-full border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="h-56 w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden flex items-center justify-center relative group">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <span className="text-gray-400">Sin Imagen Disponible</span>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg bg-red-600 px-4 py-1 rounded-full">Agotado</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col pt-4">
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                  {product.name}
                </h5>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">${parseFloat(product.price).toFixed(2)}</span>
              </div>
              
              <p className="font-normal text-gray-500 dark:text-gray-400 text-sm flex-1 line-clamp-2 mb-4">
                {product.description}
              </p>
              
              <div className="mt-auto flex flex-col gap-3">
                <Button 
                  color="blue"
                  className="w-full font-bold"
                  disabled={product.stock <= 0}
                  onClick={() => addToCart({
                    productId: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    quantity: 1,
                    stock: product.stock,
                    image_url: product.image_url
                  })}
                >
                  <HiOutlineShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {products.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Vuelve más tarde para ver nuestras novedades.</p>
          </div>
        )}
      </div>
    </div>
  );
}
