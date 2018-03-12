const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwtStrategy = require('./config/strategy');
const mountRoutes = require('./routes');
// const favicon = require('serve-favicon');

passport.use(jwtStrategy);

const app = express();
// react client to build to public and be served statically
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
  // expose entire err obj in development
  if (app.get('env') === 'development') {
    res.json(err);
  } else {
    res.json({ error: err.message });
  }
});

module.exports = app;
