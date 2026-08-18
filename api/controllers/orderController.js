const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { items, discount } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La orden debe contener al menos un artículo' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const finalAmount = Math.max(0, totalAmount - (discount || 0));

    const newOrder = await Order.createOrder(userId, finalAmount, discount || 0, items);
    
    res.status(201).json({ message: 'Orden creada con éxito', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.findByUserId(userId);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getOrderDetails(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Check if the user is authorized to view this order (must be admin or the owner)
    if (req.user.role !== 'admin' && order.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Prohibido (Acceso denegado)' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
};
