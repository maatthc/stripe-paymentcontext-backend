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
const Purchase = require('../../models/purchase');


/**
 * POST /api/purchases
 *
 * Create a new purchase with the corresponding parameters.
 */
router.post('/', async (req, res, next) => {

  const { source, amount, currency, country, shoppingCart, loyaltyCard, customerAppUuid } = req.body;

  try {
    console.log("Searching for customer : " + customerAppUuid);
    let customer = await Customer.getByUuid(customerAppUuid);
    console.dir(customer);
    if (customer === null){
      console.log("User UUID not found: " + customerAppUuid);
      res.sendStatus(500);
      next(`Error adding token to customer: "User UUID not found: " + ${customerAppUuid}`);
    }
    // Create a new purchase.
    const purchase = new Purchase({
      customer: customer.id,
      amount: amount,
      currency: currency,
      country: country,
      shoppingCart: shoppingCart,
      loyaltyCard: loyaltyCard,
    });
    // Save the purchase.
    await purchase.save();

    // Create a charge and set its destination to the pilot's account.
      //The statement descriptor must be at most 22 characters
    const charge = await stripe.charges.create({
      source: source,
      amount: purchase.amount,
      currency: purchase.currency,
      customer: customer.stripeCustomerId,
      description: config.appName,
      statement_descriptor: config.appName.substring(0, 22)
    });
    // Add the Stripe charge reference to the purchase and save it.
    purchase.stripeChargeId = charge.id;

    purchase.save();

    // Return the purchase info.
    res.send({
      status: "okay",
    });
  } catch (err) {
    res.sendStatus(500);
    next(`Error processing Purchase : ${err.message}`);
  }
});

module.exports = router;
