const router = require('express-promise-router')();
const { query, queryOne } = require('../db');

const updateUser = (fields) => {
  const { length } = Object.keys(fields);
  const updateQuery = ['UPDATE users SET'];
  const vals = [];
  Object.keys(fields).forEach((key, index) => {
    // each key val pair added to vals array and parameterized
    vals.push(`${key} = $${index + 1}`);
  });
  updateQuery.push(vals.join(', '));
  updateQuery.push(`WHERE user_id = $${length + 1}`);
  return updateQuery.join(' ');
};

const addUser = (fields) => {
  const insertQuery = ['INSERT INTO users ('];
  const items = ['name', 'email', 'title', 'password', 'permission_level_id', 'additional_audits', 'is_auditing', 'is_audited'];
  const cols = [];
  const vals = [];
  const params = [];

  // add all matched fields to cols and vals
  Object.keys(fields).forEach((key, i) => {
    if (items.includes(key)) {
      cols.push(key);
      vals.push(Object.values(fields)[i]);
    }
  });

  // check that all required fields were met
  if (cols.length !== items.length) return false;

  // build query with cols and vals
  insertQuery.push(cols.join(', '));
  insertQuery.push(') VALUES (');
  items.forEach((val, i) => {
    params.push(`$${i + 1}`);
  });
  insertQuery.push(params.join(', '));
  insertQuery.push(')');
  return {
    insertQuery: insertQuery.join(''),
    values: vals,
  };
};

// get all users
router.get('/', async (req, res) => {
  const users = await query('SELECT * FROM all_users'); // db view
  res.json(users);
});

// get user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await queryOne('SELECT * FROM users WHERE user_id = $1', [id]);
  res.json(user);
});

// update user settings
router.put('/:id', async (req, res, next) => {
  // admin only action
  if (req.user.permission !== 3) {
    const err = new Error('invalid permissions');
    err.status = 403;
    return next(err);
  }
  const { id } = req.params;
  const vals = Object.values(req.body);
  // add the user id to end of array
  vals.push(id);
  // update db info
  await query(updateUser(req.body), vals);
  return res.send();
});

// add new user
router.post('/new', async (req, res, next) => {
  // admin only action
  if (req.user.permission !== 3) {
    const err = new Error('invalid permissions');
    err.status = 403;
    return next(err);
  }
  const { insertQuery, values } = addUser(req.body);
  // if query didn't get created something went wrong
  if (!insertQuery) return res.status(422);

  const user = await queryOne(insertQuery, values);
  return res.json({ user });
});

// reset password
router.post('/reset', async (req, res) => {
  // check incoming passwords match
  if (req.body.newPassword !== req.body.newPasswordConfirm) return res.status(401).json({ error: 'passwords do not match' });

  // confirm current password
  const { id } = req.user;
  const user = await queryOne('SELECT password = crypt($1, password) as "authenticated" FROM users WHERE user_id = $2', [req.body.password, id]);
  if (!user.authenticated) return res.status(401).json({ error: 'incorrect password' });

  // update user with new password
  const vals = {
    password: req.body.newPassword,
    user_id: id,
  };
  await query(updateUser(vals), Object.values(vals));
  return res.send();
});

module.exports = router;
