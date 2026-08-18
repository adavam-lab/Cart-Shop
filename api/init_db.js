const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
  console.log('Connecting to default postgres database...');
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'ecommerce_db'");
    if (res.rowCount === 0) {
      console.log('Creating database ecommerce_db...');
      await client.query("CREATE DATABASE ecommerce_db");
    } else {
      console.log('Database ecommerce_db already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }

  console.log('Connecting to ecommerce_db...');
  const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
  });

  try {
    await dbClient.connect();
    const schemaSql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    await dbClient.query(schemaSql);
    console.log('Schema executed successfully! Tables created.');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await dbClient.end();
  }
}

init();
