const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const getDb = async () => {
  return pool;
};

// Custom query wrapper to make model migration easier
const query = async (text, params) => {
  return await pool.query(text, params);
};

// Simulates db.get for SQLite compatibility (returns first row)
const get = async (text, params) => {
  const { rows } = await pool.query(text, params);
  return rows[0];
};

// Simulates db.all for SQLite compatibility (returns all rows)
const all = async (text, params) => {
  const { rows } = await pool.query(text, params);
  return rows;
};

// Simulates db.run for SQLite compatibility
const run = async (text, params) => {
  return await pool.query(text, params);
};

module.exports = {
  pool,
  getDb,
  query,
  get,
  all,
  run
};
