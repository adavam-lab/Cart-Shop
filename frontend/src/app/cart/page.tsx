"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      router.push('/orders');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error al procesar la orden');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = Math.max(0, total - discount);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4">
        <div className="bg-gray-800/50 border border-gray-700 text-white rounded-2xl p-10 flex flex-col items-center justify-center shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <Link href="/products" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-blue-500/30">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">Carrito de Compras</h1>
      
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map(item => (
              <div key={item.productId} className="py-5 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Cant: {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between mb-3 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Descuento ($)</span>
              <input 
                type="number" 
                min="0"
                max={total.toString()}
                value={discount === 0 ? '' : discount} 
                onChange={e => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex justify-between items-center text-2xl font-black mt-4 mb-8 text-white">
              <span>Total</span>
              <span className="text-blue-500">${finalTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (isAuthenticated ? 'Proceder al Pago' : 'Inicia Sesión para Pagar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
