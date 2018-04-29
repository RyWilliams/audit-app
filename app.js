const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwtStrategy = require('./config/strategy');
const mountRoutes = require('./routes');

passport.use(jwtStrategy);

const app = express();

// react client in client/public to be served statically
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
  if (app.get('env') === 'development') {
    console.error(err);
    return res.json({
      error: {
        message: err.message,
        stackTrace: err.stack,
        status: err.status,
      },
    });
  }
  // non-descript 500 errors & no stacktrace in production
  let serverError;
  if (res.statusCode >= 500) {
    serverError = 'server error';
  }
  return res.json({ error: serverError || err.message });
});

module.exports = app;
