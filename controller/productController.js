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
      return res.status(400).json({ error: "Product code already exists" });
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

    if (status && !["Stock Out", "In Stock"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (status !== undefined) product.status = status;
    if (description !== undefined) product.description = description;
    if (discount !== undefined) product.discount = discount;

    await product.save();

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
//getting all product details including category data
export const allProducts = async (req, res) => {
  try {
    const allproducts = await Product.find().populate("category");
    
    res.status(200).json({ allproducts });
  } catch (err) {
    console.log(err);
  }
};

//getting product by name
export const searchedProduct = async (req, res) => {
  try {
    const { productName } = req.query;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const regex = new RegExp(productName, "i"); 
    const products = await Product.find({
      name: { $regex: regex },
    }).populate("category");
    //pricing calculation
    const result = products.map((product)=>{
      const finalPrice = product.price - (product.price * product.discount) / 100;
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        finalPrice,
        image: product.image,
        status: product.status,
        productCode: product.productCode,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    })

    return res.status(200).json({ products :result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

//getting products with provided three filters 
export const getproductwithFilters = async (req, res) => {
  try {
    const { categorykeyword, productName } = req.query;

    let categoryId;

    if (categorykeyword) {
      let searchresult;

      if (
        categorykeyword.length === 24 &&
        /^[a-f\d]{24}$/i.test(categorykeyword)
      ) {
        searchresult = await Category.findById(categorykeyword);
      } else {
        searchresult = await Category.findOne({ name: categorykeyword });
      }

      if (!searchresult) {
        return res.status(404).json({ error: "Category not found" });
      }

      categoryId = searchresult._id;
    }

    // Build the product query
    const query = {};

    if (categoryId) {
      query.category = categoryId;
    }

    if (productName) {
      const regex = new RegExp(productName, "i");
      query.name = { $regex: regex };
    }

    // Fetch products with filters and populate category info
    const products = await Product.find(query).populate("category");

    // Pricing calculation - add finalPrice field
    const result = products.map((product) => {
      const finalPrice = product.price - (product.price * product.discount) / 100;
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        finalPrice,
        image: product.image,
        status: product.status,
        productCode: product.productCode,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return res.status(200).json({ products: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};