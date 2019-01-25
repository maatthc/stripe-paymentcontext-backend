'use strict';
const fs = require('fs');
let config;
if (fs.existsSync(__dirname + "/../../config.js")) {
  config = require('../../config');
} else {
  config = require('../../config.default');
}
const express = require('express');
const router = express.Router();

/**
 * GET /api/settings
 *
 * Return settings for the app, specifically here the
 * Stripe publishable key to tokenize from a client app.
 */
router.get('/', (req, res, next) => {
  res.status(200).json({
    stripe_publishable_key: config.stripe.publishableKey
  });
});

module.exports = router;
