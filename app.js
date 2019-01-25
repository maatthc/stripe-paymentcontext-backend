'use strict';
const fs = require('fs');
let config;
if (fs.existsSync(__dirname + "/config.js")) {
  config = require('./config');
} else {
  config = require('./config.default');
}
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY || config.stripe.secretKey);
const express = require('express');
const session = require('cookie-session');
const passport = require('passport');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');



const app = express();
app.set('trust proxy', true);

// MongoDB.
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.dbUrl);

// View engine setup.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Enable sessions using encrypted cookies.
app.use(session({
  secret: config.secret,
  signed: true
}));

// Useful middleware setup.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore any existing authentication state.
app.use(passport.initialize());
app.use(passport.session());


app.locals.moment = moment;

// API routes used by the mobile app.
app.use('/api/settings', require('./routes/api/settings'));
app.use('/api/purchases', require('./routes/api/purchases'));
app.use('/api/customers', require('./routes/api/customers'));

// Index page 
// app.get('/', (req, res) => {
//   res.render('index');
// });

// Catch 404 errors and forward to error handler.
app.use((req, res, next) => {
  res.status(404).render('404');
});

// Error handlers.

// Development error handler.
// Will print stacktrace.
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler.
// No stacktraces leaked to user.
app.use((err, req, res) => {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Start the server on the correct port.
const server = app.listen(process.env.PORT || config.port, () => {
  console.log(`Stripe Paymentcontext Backend listening on port ${server.address().port}`);
});
