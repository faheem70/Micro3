const express = require('express');
const { consumePaymentProcessed } = require('../controllers/fulfillmentController');

const router = express.Router();

// Start consuming payment.processed messages
consumePaymentProcessed();

module.exports = router;
