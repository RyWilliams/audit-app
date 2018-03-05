const audits = require('./audits');

module.exports = (app) => {
  app.use('/audits', audits);
};
