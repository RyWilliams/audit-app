const { Pool } = require('pg');
const { PGUSER, PGDATABASE, PGPASSWORD } = require('../config/config');
const { LOCAL_PGUSER, LOCAL_PGDATABASE, LOCAL_PGPASSWORD } = require('../local');

const pool = new Pool({
  user: PGUSER || LOCAL_PGUSER,
  database: PGDATABASE || LOCAL_PGDATABASE,
  password: PGPASSWORD || LOCAL_PGPASSWORD,
});

module.exports = {
  query: async (text, params) => {
    const { rows } = await pool.query(text, params);
    return rows;
  },
  queryOne: async (text, params) => {
    const { rows } = await pool.query(text, params);
    return rows[0];
  },
  pool,
};
