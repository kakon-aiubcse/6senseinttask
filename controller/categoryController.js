import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res
      .status(201)
      .json({ message: "Category created", category: newCategory });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//getting products Filter by Category:

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
//getting all category details including category data
export const allCategories = async(req, res)=>{
 try{
   const allCategories = await Category.find();
   res.status(200).json({allCategories});
 }catch(err){
  console.log(err)

 }
}