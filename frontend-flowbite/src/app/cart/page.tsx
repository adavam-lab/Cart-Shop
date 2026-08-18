"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Spinner, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight, HiTrash, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
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

    if (items.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify({ items: orderItems, discount: discount || 0 }),
      });

      toast.success('¡Orden realizada con éxito!');
      clearCart();
      router.push('/orders');
    } catch (error: any) {
      console.error('[Checkout error]', error);
      toast.error(error.message || 'Error al realizar la orden. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = Math.max(0, total - discount);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>
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
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white text-center md:text-left">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Tabla de productos ── */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Encabezado */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide border-b border-gray-200 dark:border-gray-600">
              <div className="col-span-5">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-3 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Filas */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(item => {
                const atMax = item.quantity >= item.stock;
                const atMin = item.quantity <= 1;

                return (
                  <div
                    key={item.productId}
                    className="grid grid-cols-12 gap-2 px-4 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    {/* Producto */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">📦</div>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Stock: {item.stock} unid.</p>
                      </div>
                    </div>

                    {/* Precio unitario */}
                    <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-300">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Controles de cantidad */}
                    <div className="col-span-3 flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={atMin}
                        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <HiOutlineMinus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) updateQuantity(item.productId, val);
                        }}
                        className="w-12 text-center text-sm font-bold border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none py-1"
                      />

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={atMax}
                        title={atMax ? `Máximo ${item.stock} unidades disponibles` : ''}
                        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <HiOutlinePlus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal + eliminar */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition ml-1"
                        title="Eliminar"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Aviso stock máximo */}
                    {atMax && (
                      <div className="col-span-12 -mt-1">
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          ⚠️ Máximo disponible: {item.stock} unidades
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pie de tabla */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => { if (window.confirm('¿Vaciar todo el carrito?')) clearCart(); }}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>

        {/* ── Resumen ── */}
        <div>
          <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800 sticky top-4">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
              Resumen de la Orden
            </h5>

            <div className="flex flex-col gap-4 py-4">
              {/* Desglose por producto */}
              <div className="space-y-1.5">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[60%]">{item.name} <span className="text-xs">×{item.quantity}</span></span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between text-gray-700 dark:text-gray-300">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span className="text-sm">Descuento ($)</span>
                <TextInput
                  type="number"
                  min="0"
                  max={total.toString()}
                  value={discount.toString()}
                  onChange={e => setDiscount(Math.min(Number(e.target.value) || 0, total))}
                  sizing="sm"
                  className="w-24"
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
                {loading ? <><Spinner size="sm" light={true} className="mr-2" /> Procesando...</> : null}
                {!loading && (isAuthenticated ? 'Proceder al Pago' : 'Inicia Sesión para Pagar')}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-1">
                Al proceder, aceptas nuestros Términos y Condiciones.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
