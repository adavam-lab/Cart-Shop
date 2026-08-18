"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HiChartPie, HiShoppingBag, HiUsers, HiClipboardList, HiArrowSmLeft, HiIdentification } from "react-icons/hi";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      key: "dashboard",
      name: "Dashboard",
      href: "/admin",
      icon: <HiChartPie className="w-5 h-5" />,
    },
    {
      key: "products",
      name: "Productos",
      href: "/admin/products",
      icon: <HiShoppingBag className="w-5 h-5" />,
    },
    {
      key: "users",
      name: "Usuarios",
      href: "/admin/users",
      icon: <HiUsers className="w-5 h-5" />,
    },
    {
      key: "roles",
      name: "Roles",
      href: "/admin/roles",
      icon: <HiIdentification className="w-5 h-5" />,
    },
    {
      key: "orders",
      name: "Órdenes",
      href: "/admin/orders",
      icon: <HiClipboardList className="w-5 h-5" />,
    },
  ];

  const currentKey = menuItems.find(item => pathname === item.href || pathname?.startsWith(`${item.href}/`))?.key || "dashboard";

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col py-6 sticky top-16">
      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Panel de Control</h2>
      </div>
      
      <div className="px-2 flex-1">
        <div className="flex flex-col gap-2 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                currentKey === item.key 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-6 mt-auto">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <HiArrowSmLeft className="w-5 h-5" />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
