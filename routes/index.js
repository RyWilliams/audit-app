const audits = require('./audits');
const auth = require('./auth');

module.exports = (app) => {
  app.use('/audits', audits);
  app.use('/auth', auth);
};
