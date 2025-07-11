import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, image, status, category } =
      req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Placeholder for now — productCode will be improved later
    const productCode = "placeholder-code";

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