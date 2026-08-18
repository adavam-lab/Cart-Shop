const Order = require('../models/orderModel');
const db = require('../db');

const createOrder = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { items, discount } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La orden debe contener al menos un artículo' });
    }

    await client.query('BEGIN');

    // Verify and deduct stock for each item inside a transaction
    for (const item of items) {
      const { rows } = await client.query(
        'SELECT stock FROM products WHERE id = $1 FOR UPDATE',
        [item.productId]
      );

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Producto con ID ${item.productId} no encontrado` });
      }

      const currentStock = rows[0].stock;
      if (currentStock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Stock insuficiente para el producto ID ${item.productId}. Stock disponible: ${currentStock}`
        });
      }

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const finalAmount = Math.max(0, totalAmount - (discount || 0));

    const newOrder = await Order.createOrder(userId, finalAmount, discount || 0, items);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Orden creada con éxito', order: newOrder });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
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

const getAllOrders = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`[updateOrderStatus] id=${id}, status=${status}, user=${JSON.stringify(req.user)}`);

    const validStatuses = ['pending', 'approved', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Estado inválido: '${status}'. Valores permitidos: ${validStatuses.join(', ')}` });
    }

    const { rows } = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    console.error('[updateOrderStatus] ERROR DETALLADO:', error.message, error.code, error.detail);
    res.status(500).json({ error: 'Error interno del servidor', detail: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // First delete order items (FK constraint)
    await db.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    await db.query('DELETE FROM orders WHERE id = $1', [id]);
    res.status(204).send();
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
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderDetails,
};
