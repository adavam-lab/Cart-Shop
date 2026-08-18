const db = require('../db');

const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0];
};

const create = async (name, description, price, stock, imageUrl) => {
  const { rows } = await db.query(
    'INSERT INTO products (name, description, price, stock, image_url) VALUES (, , , , ) RETURNING *',
    [name, description, price, stock, imageUrl]
  );
  return rows[0];
};

const updateStock = async (id, newStock) => {
  const { rows } = await db.query(
    'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
    [newStock, id]
  );
  return rows[0];
};

const updateProduct = async (id, name, description, price, stock, imageUrl) => {
  const { rows } = await db.query(
    'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *',
    [name, description, price, stock, imageUrl, id]
  );
  return rows[0];
};

const deleteProduct = async (id) => {
  await db.query('DELETE FROM products WHERE id = $1', [id]);
  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  updateStock,
  updateProduct,
  deleteProduct,
};
