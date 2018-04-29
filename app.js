const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwtStrategy = require('./config/strategy');
const mountRoutes = require('./routes');

passport.use(jwtStrategy);

const app = express();

// react client to build to client/public and be served statically
app.use(express.static(path.join(__dirname, 'client', 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

mountRoutes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // print stack trace in development
  if (app.get('env') === 'development') console.error(err);
  res.json({ error: err.message });
});

module.exports = app;
