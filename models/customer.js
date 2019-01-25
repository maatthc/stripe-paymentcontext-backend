'use strict';
const fs = require('fs');
let config;
if (fs.existsSync(__dirname + "../config.js")) {
  config = require('../config');
} else {
  config = require('../config.default');
}
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY || config.stripe.secretKey);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use native promises.
mongoose.Promise = global.Promise;

// Define the Customer schema.
const CustomerSchema = new Schema({
  created: { type: Date, default: Date.now },
  // Stripe customer ID storing the payment sources.
  stripeCustomerId: String,
  customerAppUuid: String
});

// Get customer by UUID.
CustomerSchema.statics.getByUuid= async function(uuid) {
  try {
    return Customer.findOne({ 'customerAppUuid': uuid })
      .exec();
  } catch (err) {
    console.log(err);
  }
};

// Create a new customer
CustomerSchema.statics.insertCustomer = async function(uuid) {
  try {
      console.log("insertCustomer : " + uuid);
      const object = {
        customerAppUuid: uuid
      };
      const customer = new Customer(object);
      // Create a Stripe account for each of the customer.
      const stripCustomer = await stripe.customers.create({
        description: uuid
      });
      customer.stripeCustomerId = stripCustomer.id;
      // customer.customerAppUuid = uuid;
      await customer.save();
  } catch (err) {
    console.log(err);
  }
};

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
