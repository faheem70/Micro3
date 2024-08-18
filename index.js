const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./controllers/fullfillmentController');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Fulfillment Service running on port ${PORT}`);
});
