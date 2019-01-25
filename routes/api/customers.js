'use strict';
const fs = require('fs');
let config;
if (fs.existsSync(__dirname + "/../../config.js")) {
  config = require('../../config');
} else {
  config = require('../../config.default');
}
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY || config.stripe.secretKey);
const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');


// The methods below are required by the Stripe iOS SDK
// See [STPEphemeralKeyProvider](https://github.com/stripe/stripe-ios/blob/master/Stripe/PublicHeaders/STPEphemeralKeyProvider.h)

/**
 * POST /api/customers/me/ephemeral_keys
 *
 * Generate an ephemeral key for the logged in customer.
 */
router.post('/ephemeral_keys', async (req, res, next) => {
  const apiVersion = req.body['api_version'];
  const uuid = req.body['uuid'];

  try {
      var customer = await Customer.getByUuid(uuid);
      if (customer === null){
        console.log("UUID not found: " + uuid)
        await Customer.insertCustomer(uuid);
        var customer = await Customer.getByUuid(uuid);
      }
      console.log("Customer");
      console.log(customer);
      // Create ephemeral key for customer.
      const ephemeralKey = await stripe.ephemeralKeys.create({
        customer: customer.stripeCustomerId
        }, {
        stripe_version: apiVersion
      });
      // Respond with ephemeral key.
      res.send(ephemeralKey);

  } catch (err) {
    res.sendStatus(500);
    next(`Error creating ephemeral key for customer: ${err.message}`);
  }
});

module.exports = router;
