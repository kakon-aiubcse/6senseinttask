import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import generateProductCode from "../utils/generateProductcode.js";

// Helper: Send consistent error response
const sendError = (res, statusCode, message, code = "ERROR") => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
    },
  });
};

// Helper: Send consistent success response
const sendSuccess = (res, statusCode, data, message = "") => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, image, status, category } = req.body;

    // STRONG NAME VALIDATION: Only letters, spaces, and hyphens allowed
    if (!name || typeof name !== "string" || !/^[a-zA-Z\s\-]+$/.test(name)) {
      return sendError(res, 400, "Product name is required and must contain only letters, spaces, or hyphens", "VALIDATION_ERROR");
    }

    // Price must be a non-negative number
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return sendError(res, 400, "Price must be a non-negative number", "VALIDATION_ERROR");
    }

    // Discount must be between 0 and 100
    if (discount !== undefined && (typeof discount !== "number" || isNaN(discount) || discount < 0 || discount > 100)) {
      return sendError(res, 400, "Discount must be a number between 0 and 100", "VALIDATION_ERROR");
    }

    // Image URL (if provided) must be a valid URL (optional but useful)
    if (image && typeof image !== "string") {
      return sendError(res, 400, "Image must be a string (URL)", "VALIDATION_ERROR");
    }

    // Status must be one of the allowed values
    const allowedStatuses = ["In Stock", "Stock Out"];
    if (status && !allowedStatuses.includes(status)) {
      return sendError(res, 400, `Status must be one of: ${allowedStatuses.join(", ")}`, "VALIDATION_ERROR");
    }

    // Category is required
    if (!category || typeof category !== "string") {
      return sendError(res, 400, "Category ID is required and must be a string", "VALIDATION_ERROR");
    }

    // Check if the category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return sendError(res, 400, "Invalid category ID", "INVALID_CATEGORY");
    }

    // Generate product code and ensure uniqueness
    const productCode = generateProductCode(name);
    if (!productCode) {
      return sendError(res, 400, "Unable to generate product code", "PRODUCT_CODE_GENERATION_FAILED");
    }

    const exists = await Product.findOne({ productCode });
    if (exists) {
      return sendError(res, 409, "Product code already exists", "DUPLICATE_PRODUCT_CODE");
    }

    // Create and save product
    const newProduct = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      image,
      status: status || "In Stock",
      category,
      productCode,
    });

    await newProduct.save();

    return sendSuccess(res, 201, newProduct, "Product created successfully");
  } catch (err) {
    console.error(err);

    // Handle schema validation errors (like required fields or type issues)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join("; ");
      return sendError(res, 400, messages, "VALIDATION_ERROR");
    }

    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description, discount } = req.body;

    // Validate status if provided
    if (status && !["Stock Out", "In Stock"].includes(status)) {
      return sendError(res, 400, "Invalid status value must be Stock Out || In Stock ", "VALIDATION_ERROR");
    }

    // Validate discount if provided
    if (discount !== undefined && (typeof discount !== "number" || discount < 0 || discount > 100)) {
      return sendError(res, 400, "Discount must be a number between 0 and 100", "VALIDATION_ERROR");
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 404, "Product not found", "NOT_FOUND");
    }

    if (status !== undefined) product.status = status;
    if (description !== undefined) product.description = description;
    if (discount !== undefined) product.discount = discount;

    await product.save();

    return sendSuccess(res, 200, product, "Product updated successfully");
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};

// Get all products with category info
export const allProducts = async (req, res) => {
  try {
    const allproducts = await Product.find().populate("category");

    return sendSuccess(res, 200, allproducts);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};

// Search products by name (case-insensitive) + final price calculation
export const searchedProduct = async (req, res) => {
  try {
    const { productName } = req.query;

    if (!productName || typeof productName !== "string") {
      return sendError(res, 400, "Product name is required", "VALIDATION_ERROR");
    }

    const regex = new RegExp(productName, "i");
    const products = await Product.find({ name: { $regex: regex } }).populate("category");

    // Add finalPrice = price - discount
    const result = products.map((product) => {
      const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount || 0,
        finalPrice,
        image: product.image,
        status: product.status,
        productCode: product.productCode,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return sendSuccess(res, 200, result);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};

// Get products with filters (category by ID or name + productName)
export const getproductwithFilters = async (req, res) => {
  try {
    const { categorykeyword, productName } = req.query;
    let categoryId;

    if (categorykeyword) {
      let searchresult;

      if (categorykeyword.length === 24 && /^[a-f\d]{24}$/i.test(categorykeyword)) {
        searchresult = await Category.findById(categorykeyword);
      } else {
        searchresult = await Category.findOne({ name: categorykeyword });
      }

      if (!searchresult) {
        return sendError(res, 404, "Category not found ", "NOT_FOUND");
      }

      categoryId = searchresult._id;
    }

    // Build product query
    const query = {};
    if (categoryId) query.category = categoryId;
    if (productName) query.name = { $regex: new RegExp(productName, "i") };

    const products = await Product.find(query).populate("category");

    const result = products.map((product) => {
      const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount || 0,
        finalPrice,
        image: product.image,
        status: product.status,
        productCode: product.productCode,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });if (result.length === 0) {
  return res.status(404).json({ error: "Zero products assigned under this category" });
}


    return sendSuccess(res, 200, result);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};
