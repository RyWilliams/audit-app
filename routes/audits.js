const router = require('express-promise-router')();
const { body, validationResult, oneOf } = require('express-validator/check');
const db = require('../db');

// get all audits assigned to the requesting user
router.get('/', async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query('SELECT * FROM audits WHERE assigned_to = $1', [id]);
  res.json(rows);
});

// get all reviews completed for the requesting user
router.get('/reviews', async (req, res) => {
  const { id } = req.user;
  const { rows } = await db.query('SELECT * FROM audits WHERE analyst_audited = $1 AND is_complete = true', [id]);
  res.json(rows);
});

// get specific audit by id
// if audit is not completed also send active issues to render form
router.get('/:auditid', async (req, res, next) => {
  const { auditid } = req.params;
  const { rows } = await db.query('SELECT * FROM audits WHERE audit_id = $1', [auditid]);
  const audit = rows[0];
  // if the audit has already been completed send it
  if (audit.is_complete === true) return res.json(audit);
  // else provide the active issues alongside audit so the user can complete
  res.locals.audit = audit;
  return next();
}, async (req, res) => {
  const { rows } = await db.query('SELECT issue_id, issue_type FROM audit_issue_values WHERE deactivated = false');
  const issues = rows;
  const { audit } = res.locals;
  res.json({ audit, issues });
});

// manual audit creation
});

module.exports = router;
