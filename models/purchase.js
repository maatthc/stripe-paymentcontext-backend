'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use native promises.
mongoose.Promise = global.Promise;

// Define the Purchase schema.
const PurchaseSchema = new Schema({
  customer: { type : Schema.ObjectId, ref : 'Customer', required: true },
  amount: Number,
  currency: { type: String, default: 'AUD' },
  country: { type: String, default: 'AU' },
  created: { type: Date, default: Date.now },
  shoppingCart: { type: Schema.Types.Mixed },
  loyaltyCard: { type: String },
  // Stripe charge ID corresponding to this purchase.
  stripeChargeId: String
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;
