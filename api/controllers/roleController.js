const Role = require('../models/Role');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAll();
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.getById(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(role);
  } catch (err) {
    console.error('Error fetching role:', err);
    res.status(500).json({ error: 'Error al obtener el rol' });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }
    const newRole = await Role.create({ name, description, permissions });
    res.status(201).json(newRole);
  } catch (err) {
    console.error('Error creating role:', err);
    if (err.code === '23505') { // Unique constraint violation in postgres
      return res.status(400).json({ error: 'El nombre del rol ya existe' });
    }
    res.status(500).json({ error: 'Error al crear el rol' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }
    const updatedRole = await Role.update(req.params.id, { name, description, permissions });
    if (!updatedRole) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(updatedRole);
  } catch (err) {
    console.error('Error updating role:', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El nombre del rol ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.delete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json({ message: 'Rol eliminado con éxito', role: deletedRole });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ error: 'Error al eliminar el rol' });
  }
};
