const db = require('../db');

const findByEmail = async (email) => {
  const { rows } = await db.query(
    'SELECT u.*, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = $1', 
    [email]
  );
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT u.*, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1', 
    [id]
  );
  return rows[0];
};

const findAll = async () => {
  const { rows } = await db.query('SELECT u.id, u.name, u.email, u.created_at, r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id');
  return rows;
};

const create = async (name, email, passwordHash, roleName = 'customer') => {
  const { rows: roleRows } = await db.query('SELECT id FROM roles WHERE name = $1', [roleName]);
  const roleId = roleRows.length > 0 ? roleRows[0].id : null;

  const { rows } = await db.query(
    'INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id, created_at',
    [name, email, passwordHash, roleId]
  );
  
  return {
    ...rows[0],
    role: roleName
  };
};

const update = async (id, name, email, roleName) => {
  const { rows: roleRows } = await db.query('SELECT id FROM roles WHERE name = $1', [roleName]);
  const roleId = roleRows.length > 0 ? roleRows[0].id : null;

  const { rows } = await db.query(
    'UPDATE users SET name = $1, email = $2, role_id = $3, status = $4 WHERE id = $5 RETURNING id, name, email, role_id, status',
    [name, email, roleId, id]
  );
  
  return rows[0] ? { ...rows[0], role: roleName } : null;
};

const remove = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
  return true;
};

module.exports = {
  findByEmail,
  findById,
  findAll,
  create,
  update,
  remove,
};
