"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function AppNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl text-white tracking-wider hover:text-blue-400 transition">
              ADAVAM
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden sm:block">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Inicio
              </Link>
              <Link href="/products" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Productos
              </Link>
              {isAuthenticated && (
                <Link href="/cart" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition flex items-center">
                  Carrito
                  {cartCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          {/* Right Navigation */}
              <div className="flex items-center ml-4 gap-3">
                <ThemeSwitcher />
                {isAuthenticated ? (
                  <div className="relative">
                    <div>
                      <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-blue-500 transition"
                      >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </button>
                    </div>
                    
                    {isDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-50">
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Iniciado como</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link onClick={() => setIsDropdownOpen(false)} href="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Mis Órdenes
                          </Link>
                          {user?.role === 'admin' && (
                            <Link onClick={() => setIsDropdownOpen(false)} href="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Panel de Administración
                            </Link>
                          )}
                        </div>
                        <div className="py-1">
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                          >
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium text-sm shadow-md">
                    Iniciar Sesión
                  </Link>
                )}
              </div>

        </div>
      </div>
    </nav>
  );
}
