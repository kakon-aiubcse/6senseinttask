import express from "express";
import {createCategory,   productBycategory,allCategories}  from "../controller/categoryController.js";
const router = express.Router();
router.get("/allCategories", allCategories);
router.get("/productbycategory", productBycategory);
router.post("/createCategory", createCategory);

export default router;

