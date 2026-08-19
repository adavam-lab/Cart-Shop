"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <main className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Profermaco Logo" className="h-32 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Bienvenido a ADAVAM STORE
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Descubre nuestra colección exclusiva de productos premium.
            Disfruta de una experiencia de compra fluida impulsada por Flowbite React y Next.js.
          </p>

          <div className="pt-4 flex gap-4">
            <Button as={Link} href="/products" color="blue" size="xl" className="font-semibold px-4 py-2">
              Comenzar a Comprar <HiOutlineArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
