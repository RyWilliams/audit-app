const router = require('express-promise-router')();
const db = require('../db');

const updateUser = (fields) => {
  const { length } = Object.keys(fields);
  const query = ['UPDATE users SET'];
  const vals = [];
  Object.keys(fields).forEach((key, index) => {
    // each key val pair added to vals array and parameterized
    vals.push(`${key} = $${index + 1}`);
  });
  query.push(vals.join(', '));
  query.push(`WHERE user_id = $${length + 1}`);
  return query.join(' ');
};

const addUser = (fields) => {
  const query = ['INSERT INTO users ('];
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
  query.push(cols.join(', '));
  query.push(') VALUES (');
  items.forEach((val, i) => {
    params.push(`$${i + 1}`);
  });
  query.push(params.join(', '));
  query.push(')');
  return {
    query: query.join(''),
    values: vals,
  };
};

// get all users
router.get('/', async (req, res) => {
  const { rows: users } = await db.query('SELECT * FROM all_users'); // db view
  res.json(users);
});

// get user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows: user } = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);
  res.json(user[0]);
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
  await db.query(updateUser(req.body), vals);
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
  const { query, values } = addUser(req.body);
  // if query didn't get created something went wrong
  if (!query) return res.status(422);

  const { rows } = await db.query(query, values);
  const user = rows[0];
  return res.json({ user });
});

// reset password
router.post('/reset', async (req, res) => {
  // check incoming passwords match
  if (req.body.newPassword !== req.body.newPasswordConfirm) return res.status(401).json({ error: 'passwords do not match' });

  // confirm current password
  const { id } = req.user;
  const { rows } = await db.query('SELECT password = crypt($1, password) as "authenticated" FROM users WHERE user_id = $2', [req.body.password, id]);
  const user = rows[0];
  if (!user.authenticated) return res.status(401).json({ error: 'incorrect password' });

  // update user with new password
  const vals = {
    password: req.body.newPassword,
    user_id: id,
  };
  await db.query(updateUser(vals), Object.values(vals));
  return res.send();
});

module.exports = router;
