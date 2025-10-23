import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";


export const addProduct = async (req, res) => {
  try {
    const { title, description, category, subCategory, variants } = req.body;

    if (!title || !category || !subCategory)
      return res.status(400).json({ message: "Required fields missing" });

    const cat = await Category.findById(category);
    const subCat = await SubCategory.findById(subCategory);
    if (!cat || !subCat)
      return res.status(404).json({ message: "Invalid Category or Subcategory" });

    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = new Product({
      title,
      description,
      category,
      subCategory,
      variants: JSON.parse(variants),
      images,
    });

    await product.save();

    res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error in addProduct:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, subCategory, variants } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : undefined;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        subCategory,
        variants: variants ? JSON.parse(variants) : undefined,
        ...(images && { images }),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

