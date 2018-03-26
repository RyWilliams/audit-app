const router = require('express-promise-router')();
const db = require('../db');

// get all audits assigned to the requesting user
router.get('/', async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query('SELECT * FROM audits WHERE assigned_to = $1', [id]);
  res.json(rows);
});

// get specific audit by id
router.get('/:auditid', async (req, res) => {
  const { auditid } = req.params;
  const { rows } = await db.query('SELECT * FROM audits WHERE audit_id = $1', [auditid]);
  res.json(rows[0]);
});

module.exports = router;
