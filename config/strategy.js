const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWTKEY } = require('./config');
const { LOCAL_JWTKEY } = require('../local');
const { queryOne } = require('../db');

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTKEY || LOCAL_JWTKEY,
};

const strategy = new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
  const { id } = jwtPayload;
  try {
    const query = `
      SELECT user_id as id,
        name,
        email,
        title,
        deactivated,
        permission_level_id as permission
      FROM users
      WHERE user_id = $1;
    `;
    const user = await queryOne(query, [id]);
    if (user && !user.deactivated) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

module.exports = strategy;
