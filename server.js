// server.js
import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//dotenv config
dotenv.config({override:true, silent:true});
const app = express();


// Middleware
app.use(json());

// Basic route
app.get('/', (req, res) => {
  res.send('Working API...');
});

//connecting mongo db 
mongoose.connect(process.env.MONGO_URI, ).then(()=>{console.log("mongodb connected locally")}).catch((err)=>{console.log("found error", err)})


// Start server
const PORT = 2001;
app.listen(PORT, () => {
  console.log(`Server onboard successfully `);
});
