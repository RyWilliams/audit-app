const { Pool } = require('pg');
const { PGUSER, PGDATABASE, PGPASSWORD } = require('../config/config');

const pool = new Pool({
  user: PGUSER,
  database: PGDATABASE,
  password: PGPASSWORD,
});

module.exports = {
  query: async (text, params) => {
    const rows = await pool.query(text, params);
    return rows;
  },
  queryOne: async (text, params) => {
    const rows = await pool.query(text, params);
    return rows[0];
  },
  pool,
};
