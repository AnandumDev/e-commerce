import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

export const addSubCategory = async (req, res) => {
  try {
    const { name,category } = req.body;

    if (!name || !category)
      return res.status(400).json({ message: "Name and Category are required" });

    const parent = await Category.findById(category);
    if (!parent)
      return res.status(404).json({ message: "Parent Category not found" });

    const subCategory = new SubCategory({ name, category });
    await subCategory.save();

    res.status(200).json({ message: "Subcategory added successfully", subCategory });
  } catch (error) {
    console.error("Error in addSubCategory:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category", "name").sort({ createdAt: -1 });
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error in getSubCategories:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
