const audits = require('./audits');
const auth = require('./auth');
const passport = require('passport');

const hasAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
  app.use('/', auth);
  // protected routes
  app.use('/audits', hasAuth, audits);
};
