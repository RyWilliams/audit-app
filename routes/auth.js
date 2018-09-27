const router = require('express-promise-router')();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');
const { JWTKEY } = require('../config/config');
const { queryOne } = require('../db');

router.post('/login', [
  body('email')
    .exists().withMessage('email missing')
    .isEmail()
    .trim(),
  body('password')
    .exists().withMessage('password missing'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.mapped() });
  }
  // if there are no errors process requests
  const { email, password } = req.body;
  const userQuery = `
    SELECT user_id,
      name,
      email,
      title,
      deactivated,
      password = crypt($1, password) as "authenticated"
    FROM users
    WHERE email = $2;
  `;
  const user = await queryOne(userQuery, [password, email]);
  if (!user) return res.status(404).json({ error: 'user not found' });
  if (!user.authenticated) return res.status(401).json({ error: 'incorrect password' });
  if (user.deactivated) return res.status(403).json({ error: 'inactive account' });

  const token = jwt.sign({
    id: user.user_id,
    name: user.name,
    email: user.email,
    title: user.title,
  }, JWTKEY);

  return res.status(200).json({ token });
});

module.exports = router;
