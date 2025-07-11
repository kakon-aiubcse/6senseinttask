// server.js
import express, { json } from 'express';
const app = express();

// Middleware
app.use(json());

// Basic route
app.get('/', (req, res) => {
  res.send('Working API...');
});


// Start server
const PORT = 2001;
app.listen(PORT, () => {
  console.log(`Server onboard successfully `);
});
