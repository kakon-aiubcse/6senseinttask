import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());  // Body parser for JSON
app.use(cors());          // Enable CORS

// Routes
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);

// MongoDB connection with options and logging
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process if DB connection fails
});

// Start server
const PORT = process.env.PORT || 2001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
