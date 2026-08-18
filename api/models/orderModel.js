const db = require('../db');

const createOrder = async (userId, totalAmount, discount, items) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount, discount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, totalAmount, discount, 'pending']
    );
    const order = orderResult.rows[0];
    const orderId = order.id;
    
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING id',
        [orderId, item.productId, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }
    
    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const findByUserId = async (userId) => {
  const { rows } = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return rows;
};

const getOrderDetails = async (orderId) => {
  const { rows: orderRows } = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  const order = orderRows[0];
  
  if (!order) return null;
  
  const { rows: items } = await db.query(
    'SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
    [orderId]
  );
  
  return {
    ...order,
    items
  };
};

module.exports = {
  createOrder,
  findByUserId,
  getOrderDetails,
};
