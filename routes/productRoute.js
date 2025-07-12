import express from "express";
import {
  createProduct,
  updateProduct,
  allProducts,
} from "../controller/productController.js";
const router = express.Router();

router.post("/createproduct", createProduct);
router.put("/updateproduct/:id", updateProduct);
router.get("/allProducts", allProducts);

export default router;
