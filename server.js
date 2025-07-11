// server.js
import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";

//dotenv config
dotenv.config({override:true, silent:true});
const app = express();



// Middleware
app.use(json());
app.use(cors());
app.use(express.json());

// Basic route
// app.get('/', (req, res) => {
//   res.send('Working API...');
// });
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);


//connecting mongo db 
mongoose.connect(process.env.MONGO_URI, ).then(()=>{console.log("mongodb connected locally")}).catch((err)=>{console.log("found error", err)})


// Start server
const PORT = 2001;
app.listen(PORT, () => {
  console.log(`Server onboard successfully `);
});
