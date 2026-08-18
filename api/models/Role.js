const db = require('../db');

class Role {
  static async getAll() {
    const query = 'SELECT * FROM roles ORDER BY id ASC';
    const { rows } = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM roles WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async getByName(name) {
    const query = 'SELECT * FROM roles WHERE name = $1';
    const { rows } = await db.query(query, [name]);
    return rows[0];
  }

  static async create(roleData) {
    const { name, description, permissions } = roleData;
    // permissions is expected to be an array of strings, we store it as JSONB
    const query = `
      INSERT INTO roles (name, description, permissions)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, description, JSON.stringify(permissions || [])];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, roleData) {
    const { name, description, permissions } = roleData;
    const query = `
      UPDATE roles
      SET name = $1, description = $2, permissions = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [name, description, JSON.stringify(permissions || []), id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM roles WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Role;
