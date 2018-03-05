const router = require('express-promise-router')();
const db = require('../db');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT name FROM users WHERE title = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.log(err.stack);
  }
});

module.exports = router;
