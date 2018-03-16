const router = require('express-promise-router')();
const jwt = require('jsonwebtoken');
const { JWTKEY } = require('../config/config');
const db = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await db.query('SELECT user_id, name, email, title, deactivated, password = crypt($1, password) as "authenticated" FROM users WHERE email = $2', [password, email]);
  const user = rows[0];

  if (!user) return res.status(404).json({ error: 'user not found' });
  if (!user.authenticated) return res.status(401).json({ error: 'incorrect password' });
  if (user.deactivated) return res.status(403).json({ error: 'inactive account' });

  const token = jwt.sign({ id: user.user_id }, JWTKEY);
  return res.status(200).json({ token });
});

module.exports = router;
