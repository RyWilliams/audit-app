const { Pool } = require('pg');
const { PGUSER, PGDATABASE, PGPASSWORD } = require('../config/config');

const pool = new Pool({
  user: PGUSER,
  database: PGDATABASE,
  password: PGPASSWORD,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
