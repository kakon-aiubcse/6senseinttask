import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import generateProductCode from "../utils/generateProductcode.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, image, status, category } =
      req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const productCode = generateProductCode(name);

    // Ensure uniqueness
    const exists = await Product.findOne({ productCode });
    if (exists) {
      return res.status(400).json({ error: 'Product code already exists' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      image,
      status,
      category,
      productCode,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
export default createProduct;