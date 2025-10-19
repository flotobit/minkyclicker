const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage (for demonstration, use a database for production)
let inventories = {};
let trades = [];

// Endpoint to handle trade requests
app.post('/trade/request', (req, res) => {
  const trade = req.body;
  if (!trade || !trade.from || !trade.to || !trade.items) {
    return res.status(400).json({ error: 'Invalid trade request format' });
  }
  trades.push(trade);
  res.json({ status: 'Trade requested', trade });
});

// Endpoint to accept a trade - placeholder logic
app.post('/trade/accept', (req, res) => {
  const { tradeId } = req.body;
  // Here you would find the trade by ID, validate and process it
  // For demo, assume success
  res.json({ status: 'Trade accepted', tradeId });
});

// Endpoint to get inventory of a user
app.get('/inventory/:user', (req, res) => {
  const user = req.params.user;
  res.json(inventories[user] || {});
});

// Define the port dynamically for Render compatibility
const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
