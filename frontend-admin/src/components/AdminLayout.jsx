import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Avatar } from 'flowbite-react';
import { LayoutDashboard, Users, Package, ShoppingCart, Menu, LogOut, Settings } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Productos', href: '/products', icon: Package },
    { name: 'Órdenes', href: '/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar fluid rounded className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 z-50">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
              <Menu size={24} />
            </button>
            <NavbarBrand as={Link} to="/">
              <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Package size={20} />
                </div>
                AdminPro
              </span>
            </NavbarBrand>
          </div>
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
              }
            >
              <DropdownHeader>
                <span className="block text-sm">Administrador</span>
                <span className="block truncate text-sm font-medium">admin@adminpro.com</span>
              </DropdownHeader>
              <DropdownItem icon={Settings}>Ajustes</DropdownItem>
              <DropdownDivider />
              <DropdownItem icon={LogOut}>Cerrar sesión</DropdownItem>
            </Dropdown>
          </div>
        </div>
      </Navbar>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative md:translate-x-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800`}>
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center p-3 rounded-xl group transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold shadow-sm' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition duration-75 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 w-full h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {isOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 z-30 md:hidden" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
