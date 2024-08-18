const mongoose = require('mongoose');

const fulfillmentSchema = new mongoose.Schema({
  fulfillmentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
}, {
  timestamps: true,
});

const Fulfillment = mongoose.model('Fulfillment', fulfillmentSchema);
module.exports = Fulfillment;
