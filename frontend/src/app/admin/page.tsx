import { HiOutlineUsers, HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineCurrencyDollar } from "react-icons/hi";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center space-x-4 p-5">
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900">
              <HiOutlineCurrencyDollar className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos Totales</p>
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white">$24,500.00</h5>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center space-x-4 p-5">
            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900">
              <HiOutlineShoppingBag className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Productos</p>
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white">1,245</h5>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center space-x-4 p-5">
            <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900">
              <HiOutlineUsers className="w-8 h-8 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios</p>
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white">8,342</h5>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center space-x-4 p-5">
            <div className="p-3 bg-orange-100 rounded-lg dark:bg-orange-900">
              <HiOutlineClipboardList className="w-8 h-8 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Órdenes Pendientes</p>
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white">45</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actividad Reciente</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-5">
            <p className="text-gray-500 dark:text-gray-400">Aquí se puede mostrar un gráfico o listado de actividad reciente de órdenes y registros.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
