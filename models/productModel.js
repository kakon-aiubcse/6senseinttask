import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name must be less than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description must be less than 500 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot be more than 100"],
  },
  image: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Stock Out', 'In Stock'],
    default: 'In Stock',
  },
  productCode: {
    type: String,
    unique: true,
    required: [true, "Product code is required"],
    trim: true,
    uppercase: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, "Category is required"],
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
