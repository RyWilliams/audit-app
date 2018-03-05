const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const path = require('path');
const bodyParser = require('body-parser');
const mountRoutes = require('./routes');
const { pool } = require('./db');
// const favicon = require('serve-favicon');

const app = express();
mountRoutes(app);
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  store: new PgSession({ pool }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}));

// react client to build to public and be served statically
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);

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
