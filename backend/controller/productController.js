import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";


export const addProduct = async (req, res) => {
  try {
    const { title, description, subCategory, variants } = req.body;

    const productImages = req.files.map((file) => file.path);

    const newProduct = await Product.create({
      title,
      description,
      subCategory,
      variants: JSON.parse(variants),
      images: productImages,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const subCategory = req.query.subCategory || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (category) {
      const subCategories = await SubCategory.find({
        category: category,
      }).select("_id");
      const subCategoryIds = subCategories.map((sub) => sub._id);

      if (subCategory) {
        if (!subCategoryIds.includes(subCategory)) {
          return res.status(200).json({
            products: [],
            currentPage: page,
            totalPages: 0,
            totalProducts: 0,
          });
        }
        query.subCategory = subCategory;
      } else {
        query.subCategory = { $in: subCategoryIds };
      }
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate({
        path: "subCategory",
        select: "name",
        populate: { path: "category", select: "name" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subCategory, variants } = req.body;

    let parsedVariants;
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        return res.status(400).json({ message: "Invalid variants format" });
      }
    }

    const images = req.files ? req.files.map((file) => file.path) : undefined;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(subCategory && { subCategory }),
      ...(parsedVariants && { variants: parsedVariants }),
      ...(images && { images }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
      path: "subCategory",
      select: "name category",
      populate: { path: "category", select: "name" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product details fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ message: "Error fetching product details" });
  }
};
