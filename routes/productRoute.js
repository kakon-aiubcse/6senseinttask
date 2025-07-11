import express from "express";
import {
  createProduct,
  updateProduct,
  allProducts,
  searchedProduct,
  getproductwithFilters,
} from "../controller/productController.js";
const router = express.Router();

router.post("/createproduct", createProduct);
router.put("/updateproduct/:id", updateProduct);
router.get("/allProducts", allProducts);
router.get("/searchproductByname", searchedProduct);
router.get("/productwithfilter", getproductwithFilters)


export default router;
