const { Pool } = require('pg');
require('dotenv').config();

// Initialize PostgreSQL pool using environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Check database connection
pool.connect()
    .then(() => console.log('PostgreSQL connection established.'))
    .catch((err) => console.error('Database connection failed:', err.message));

module.exports = pool;
