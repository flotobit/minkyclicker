const express = require('express');
const app = express();
app.use(express.json());

let inventories = {}; // user inventories
let trades = []; // active trade requests

app.post('/trade/request', (req, res) => {
  trades.push(req.body);
  res.json({ status: 'Trade requested!' });
});

app.post('/trade/accept', (req, res) => {
  // implement trade acceptance logic here
  res.json({ status: 'Trade accepted!' });
});

app.get('/inventory/:user', (req, res) => {
  res.json(inventories[req.params.user] || {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
