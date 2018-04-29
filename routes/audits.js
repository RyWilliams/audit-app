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
router.post('/new', (req, res, next) => {
  // analyst admin level required (3), as set by passport auth on req.user
  if (req.user.permission === 3) return next();
  // else not authorized
  const err = new Error('invalid permissions');
  err.status = 403;
  return next(err);
}, [
  // validate inputs
  body('assignedTo').exists(),
  body('analystAudited').exists(),
  body('devId').exists().isUUID(),
  body('url').exists().trim(),
], oneOf([
  // either selling or leasing status must exist
  body('sellingStatus').isInt({ min: 1, max: 4 }),
  body('leasingStatus').isInt({ min: 1, max: 4 }),
]), async (req, res) => {
  const errors = validationResult(req);
  // send back any validation errors
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.mapped() });
  }
  // no errors, extract and insert values
  const {
    assignedTo,
    analystAudited,
    devId,
    url,
    sellingStatus,
    leasingStatus,
  } = req.body;

  const text = 'INSERT INTO audits (assigned_to, analyst_audited, development_id, url, selling_status_id, leasing_status_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [assignedTo, analystAudited, devId, url, sellingStatus, leasingStatus];

  const { rows } = await db.query(text, values);
  const audit = rows[0];
  // all went as planned, return the inserted row as confirmation
  return res.status(200).json({ audit });
});

// submit audit results
router.post('/:auditid', oneOf([
  // issues will be null if audit submitted with no issues
  body('issues').custom(value => value === null),
  // else each issue should have a numbered id and note field
  [
    body('issues.*.id').exists().isInt(),
    body('issues.*.note').exists().trim(),
  ],
]), async (req, res) => {
  const { issues } = req.body;
  const { auditid } = req.params;
  const { rows } = await db.query('SELECT * FROM audits WHERE audit_id = $1', [auditid]);
  const audit = rows[0];

  // audit must be assigned to requesting user and not yet complete
  if (req.user.id !== audit.assigned_to || audit.is_complete) {
    return res.status(403).json({ error: 'not authorized' });
  }

  // send back any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.mapped() });
  }

  // no issues - close audit
  if (!issues) {
    await db.query('UPDATE audits SET completed_on = NOW(), is_complete = true WHERE audit_id = $1', [auditid]);
    return res.status(200).send();
  }

  // else convert issues into query friendly format
  const issueIds = [];
  const issueNotes = [];
  issues.forEach((e) => {
    issueIds.push(e.id);
    issueNotes.push(e.note);
  });
  // insert formatted vals into db
  const vals = [auditid, issueIds, issueNotes];
  await db.query('INSERT INTO audit_issues (audit_id, issue_id, issue_note) SELECT $1, * FROM UNNEST($2::int[], $3::text[]) ON CONFLICT DO NOTHING', vals);
  // note: db trigger will set audit to complete after insert of issues
  return res.status(200).send();
});

module.exports = router;
