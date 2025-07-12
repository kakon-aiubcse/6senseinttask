import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name must be less than 50 characters"],
    match: [/^[a-zA-Z\s\-]+$/, "Name can only contain letters, spaces, and hyphens"],
  },
  description: {
    type: String,
    maxlength: [200, "Description must be less than 200 characters"],
    trim: true,
    default: "",
  },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
