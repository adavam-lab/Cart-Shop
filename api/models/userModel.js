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

// Map frontend role names to DB role names
const normalizeRole = (role) => {
  if (!role) return 'customer';
  const map = { 'cliente': 'customer', 'administrador': 'admin', 'customer': 'customer', 'admin': 'admin' };
  return map[role.toLowerCase()] || role.toLowerCase();
};

const create = async (name, email, passwordHash, roleName = 'customer') => {
  const normalized = normalizeRole(roleName);
  const { rows: roleRows } = await db.query('SELECT id FROM roles WHERE name = $1', [normalized]);
  const roleId = roleRows.length > 0 ? roleRows[0].id : null;
  if (!roleId) throw new Error(`Rol '${roleName}' no encontrado en la base de datos`);

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
  const normalized = normalizeRole(roleName);
  const { rows: roleRows } = await db.query('SELECT id FROM roles WHERE name = $1', [normalized]);
  const roleId = roleRows.length > 0 ? roleRows[0].id : null;
  if (!roleId) throw new Error(`Rol '${roleName}' no encontrado en la base de datos`);

  const { rows } = await db.query(
    'UPDATE users SET name = $1, email = $2, role_id = $3 WHERE id = $4 RETURNING id, name, email, role_id',
    [name, email, roleId, id]
  );
  
  return rows[0] ? { ...rows[0], role: normalized } : null;
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
