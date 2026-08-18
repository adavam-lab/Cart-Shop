const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    
    const newProduct = await Product.create(name, description, price, stock, imageUrl);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl } = req.body;
    
    const updatedProduct = await Product.updateProduct(id, name, description, price, stock, imageUrl);
    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
