const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya existe' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password || 'password123', saltRounds);

    const newUser = await User.create(name, email, passwordHash, role);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const updatedUser = await User.update(id, name, email, role);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.remove(id);
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
