"use client";

import { Avatar, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";
import { HiShoppingCart } from "react-icons/hi";

export function NavbarComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const pathname = usePathname();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Navbar fluid rounded className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <NavbarBrand as={Link} href="/">
        <img src="/logo.png" alt="Profermaco Logo" className="h-10 object-contain sm:h-12" />
      </NavbarBrand>
      <div className="flex md:order-2 gap-2 items-center">
        <Link href="/cart" className="relative mr-4 text-gray-700 dark:text-gray-300 hover:text-blue-600">
          <HiShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </div>
          )}
        </Link>

        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} rounded />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user?.name}</span>
              <span className="block truncate text-sm font-medium">{user?.email}</span>
            </DropdownHeader>
            <Link href="/orders">
              <DropdownItem>Mis Órdenes</DropdownItem>
            </Link>

            <DropdownDivider />
            <DropdownItem onClick={logout}>Cerrar Sesión</DropdownItem>
          </Dropdown>
        ) : (
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Iniciar Sesión
          </Link>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink as={Link} href="/" active={pathname === '/'}>
          Inicio
        </NavbarLink>
        <NavbarLink as={Link} href="/products" active={pathname === '/products'}>
          Productos
        </NavbarLink>
        {isAuthenticated && (
          <NavbarLink as={Link} href="/orders" active={pathname === '/orders'}>
            Órdenes
          </NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
