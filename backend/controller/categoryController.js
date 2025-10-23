import Category from "../models/Category.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name, description });
    await category.save();

    res.status(200).json({ message: "Category added successfully", category });
  } catch (error) {
    console.error("Error in addCategory:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getCategories:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};