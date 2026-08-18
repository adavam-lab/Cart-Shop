"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Spinner, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para continuar.');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify({ items, discount }),
      });
      toast.success('¡Orden realizada con éxito!');
      clearCart();
      router.push(`/orders`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error al realizar la orden');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = Math.max(0, total - discount);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-center max-w-md w-full">
          <img src="/next.svg" alt="Empty Cart" className="mx-auto h-16 w-16 opacity-20 mb-4 dark:invert" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">Parece que aún no has agregado ningún artículo a tu carrito.</p>
          <Button as={Link} href="/products" color="blue" className="w-full">
            Continuar Comprando <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white text-center md:text-left">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Producto</TableHeadCell>
              <TableHeadCell>Precio</TableHeadCell>
              <TableHeadCell>Cantidad</TableHeadCell>
              <TableHeadCell>Subtotal</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Acciones</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {items.map(item => (
                <TableRow key={item.productId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    {item.name}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">
                    ${(item.quantity * item.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-medium flex items-center"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
              Resumen de la Orden
            </h5>
            
            <div className="flex flex-col gap-4 py-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span>Descuento ($)</span>
                <TextInput 
                  type="number" 
                  min="0"
                  max={total.toString()}
                  value={discount.toString() || "0"} 
                  onChange={e => setDiscount(Number(e.target.value) || 0)}
                  sizing="sm"
                  className="w-24 text-right"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              <Button 
                color="blue"
                size="xl"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-2"
              >
                {loading ? <Spinner size="sm" light={true} className="mr-2" /> : null}
                {isAuthenticated ? 'Proceder al Pago' : 'Inicia Sesión para Pagar'}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Al proceder, aceptas nuestros Términos y Condiciones.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
