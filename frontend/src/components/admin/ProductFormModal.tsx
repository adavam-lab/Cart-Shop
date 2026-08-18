"use client";


import { useState, useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl?: string;
};

interface ProductFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id"> | Product) => void;
  product?: Product | null;
}

export default function ProductFormModal({ show, onClose, onSave, product }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    imageUrl: "",
  });

  const categories = [
    { value: "Ropa", label: "Ropa" },
    { value: "Calzado", label: "Calzado" },
    { value: "Accesorios", label: "Accesorios" },
    { value: "Electrónica", label: "Electrónica" }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl || "",
      });
    } else {
      setFormData({ name: "", price: 0, stock: 0, category: "", description: "", imageUrl: "" });
    }
  }, [product, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...formData, id: product.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {formData.id ? 'Editar' : 'Añadir'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <p className="text-gray-500 dark:text-gray-400">Funcionalidad de formulario con Tailwind próximamente...</p>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
