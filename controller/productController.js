import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import generateProductCode from "../utils/generateProductcode.js";

export const createProduct = async (req, res) => {
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
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description, discount } = req.body;

    if (status && !['Stock Out', 'In Stock'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (status !== undefined) product.status = status;
    if (description !== undefined) product.description = description;
    if (discount !== undefined) product.discount = discount;

    await product.save();

    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};