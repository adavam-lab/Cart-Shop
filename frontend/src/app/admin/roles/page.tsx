"use client";

import { useState } from "react";
import { HiPlus, HiPencilAlt, HiTrash } from "react-icons/hi";
import RoleFormModal, { Role } from "@/components/admin/RoleFormModal";

// Datos de prueba (Mocks)
const initialRoles: Role[] = [
  { id: "1", name: "Administrador", description: "Acceso total al sistema y configuraciones", permissions: ["leer:productos", "escribir:productos", "eliminar:productos", "leer:usuarios", "escribir:usuarios", "gestionar:ordenes"] },
  { id: "2", name: "Cliente", description: "Acceso estándar para compras", permissions: ["leer:productos"] },
  { id: "3", name: "Vendedor", description: "Puede gestionar productos y ver órdenes", permissions: ["leer:productos", "escribir:productos", "leer:usuarios", "gestionar:ordenes"] },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleAddClick = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este rol?")) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const handleSaveRole = (role: Omit<Role, "id"> | Role) => {
    if ("id" in role) {
      setRoles(roles.map(r => r.id === role.id ? role as Role : r));
    } else {
      const newRole: Role = {
        ...role,
        id: Math.random().toString(36).substr(2, 9),
      };
      setRoles([...roles, newRole]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Roles</h1>
        <button 
          onClick={handleAddClick} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Crear Rol
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre del Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permisos</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {role.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {role.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {role.permissions.map(p => (
                      <span key={p} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                        {p}
                      </span>
                    ))}
                    {role.permissions.length === 0 && <span className="text-gray-400 text-sm">Ninguno</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => handleEditClick(role)}
                      className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Editar"
                    >
                      <HiPencilAlt className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(role.id)}
                      className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RoleFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRole}
        role={editingRole}
      />
    </div>
  );
}
