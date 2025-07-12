import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

// Helper: send error response consistently
const sendError = (res, statusCode, message, code = "ERROR") => {
  return res.status(statusCode).json({
    success: false,
    error: { message, code },
  });
};

// Helper: send success response consistently
const sendSuccess = (res, statusCode, data, message = "") => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string") {
      return sendError(
        res,
        400,
        "Category name is required and must be a string",
        "VALIDATION_ERROR"
      );
    }

    // Check uniqueness (case insensitive because schema uses lowercase)
    const exists = await Category.findOne({ name: name.toLowerCase().trim() });
    if (exists) {
      return sendError(
        res,
        409,
        "Category already exists",
        "DUPLICATE_CATEGORY"
      );
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    return sendSuccess(res, 201, newCategory, "Category created successfully");
  } catch (err) {
    console.error(err);

    // Handle Mongoose validation errors explicitly
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e) => e.message)
        .join("; ");
      return sendError(res, 400, messages, "VALIDATION_ERROR");
    }

    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};

// Get products filtered by category (by ID or name)
export const productBycategory = async (req, res) => {
  try {
    //taking variable from request query
    const { categorykeyword } = req.query;
    if (!categorykeyword) {
      return res.status(500).json({ error: "category ID/name required" });
    }

    //searching by id or name both allowed
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
      return res.status(404).json({ error: "Searched Category was not found" });
    }
    //finding all the product based on searched keyword
    const productresult = await Product.find({
      category: searchresult._id,
    }).populate("category");
    return res.status(200).json({ productresult });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get all categories
export const allCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    return sendSuccess(res, 200, allCategories);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error", "SERVER_ERROR");
  }
};
