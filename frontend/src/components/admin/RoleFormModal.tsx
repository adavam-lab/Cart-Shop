"use client";

import { Modal, ModalDialog, ModalHeader, ModalBody, ModalFooter, Button, Input, CheckboxGroup, Checkbox } from "@heroui/react";
import { useState, useEffect } from "react";

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

interface RoleFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (role: Omit<Role, "id"> | Role) => void;
  role?: Role | null;
}

export default function RoleFormModal({ show, onClose, onSave, role }: RoleFormModalProps) {
  const [formData, setFormData] = useState<Omit<Role, "id">>({
    name: "",
    description: "",
    permissions: [],
  });
  
  const availablePermissions = [
    "leer:productos", "escribir:productos", "eliminar:productos", 
    "leer:usuarios", "escribir:usuarios", "gestionar:ordenes"
  ];

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions || [],
      });
    } else {
      setFormData({ name: "", description: "", permissions: [] });
    }
  }, [role, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionsChange = (values: string[]) => {
    setFormData(prev => ({ ...prev, permissions: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      onSave({ ...formData, id: role.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={show} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <ModalDialog>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {role ? "Editar Rol" : "Crear Rol"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1"><label className="text-sm text-gray-700">Nombre del Rol</label><Input
                
                name="name"
                placeholder="Ej. Administrador, Cliente"
                required
                value={formData.name}
                onChange={handleChange}
              /></div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  placeholder="Breve descripción del rol"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500 min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Permisos</label>
                <CheckboxGroup
                  value={formData.permissions}
                  onChange={handlePermissionsChange}
                  
                  className="gap-2"
                >
                  {availablePermissions.map(permission => (
                    <Checkbox key={permission} value={permission}>
                      {permission}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onPress={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {role ? "Guardar Cambios" : "Crear Rol"}
            </Button>
          </ModalFooter>
        </form>
      </ModalDialog>
    </Modal>
  );
}
