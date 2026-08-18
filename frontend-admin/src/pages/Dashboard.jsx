import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Usuarios Totales</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">1,234</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Productos Activos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">56</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Órdenes Hoy</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</p>
        </div>
      </div>
    </div>
  );
}
