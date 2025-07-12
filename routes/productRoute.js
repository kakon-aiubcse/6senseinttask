import express from "express";
import {createProduct, updateProduct} from "../controller/productController.js";
const router = express.Router();

router.post("/createproduct", createProduct);
router.put("/updateproduct/:id", updateProduct)
export default router;