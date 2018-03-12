const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWTKEY } = require('./config');
const db = require('../db');

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTKEY,
};

const strategy = new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
  const { id } = jwtPayload;
  try {
    const { rows } = await db.query('SELECT user_id, name, email, title, deactivated, permission_level_id FROM users WHERE user_id = $1', [id]);
    const user = rows[0];
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

module.exports = strategy;
