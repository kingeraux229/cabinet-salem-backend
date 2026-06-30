// db.js — gère la connexion à la base de données PostgreSQL
// et crée automatiquement la table "rendezvous" si elle n'existe pas encore.

const { Pool } = require('pg');

// DATABASE_URL est fournie automatiquement par Railway une fois que le
// service backend est relié au service Postgres.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway.internal')
    ? false
    : { rejectUnauthorized: false },
});

// Crée la table "rendezvous" si elle n'existe pas déjà.
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rendezvous (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      telephone VARCHAR(50) NOT NULL,
      service VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      heure VARCHAR(10) NOT NULL,
      statut VARCHAR(50) NOT NULL DEFAULT 'confirme',
      code_confirmation VARCHAR(20) NOT NULL,
      cree_le TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Table "rendezvous" prête.');
}

module.exports = { pool, initDb };
