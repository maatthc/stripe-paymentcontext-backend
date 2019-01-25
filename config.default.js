'use strict';

module.exports = {
  // App name.
  appName: 'Stripe PaymentContext Backend',

  // HTTP port
  port: 8080,

  //MongoDB ulr
  dbUrl: 'mongodb://localhost:27017/eCommerce',

  // Secret for cookie sessions.
  secret: 'YOUR_SECRET',

  // Configuration for Stripe.
  // API Keys: https://dashboard.stripe.com/account/apikeys
  stripe: {
    secretKey: 'sk_test_',
    publishableKey: 'pk_test_',
  }
};
