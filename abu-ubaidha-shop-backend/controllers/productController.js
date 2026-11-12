import Product from "../models/Product.js";

// ================= GET ALL PRODUCTS =================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= ADD PRODUCT =================

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      oldPrice,
      discount,
      rating,
      reviews,
      category,
      image,
      description,
      stock,
    } = req.body;

    // Required fields
    if (
      !name ||
      price === undefined ||
      !category ||
      !image ||
      !description ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required product fields.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      brand: brand?.trim() || "AU Fashion",

      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      discount: Number(discount) || 0,
      rating: Number(rating) || 0,
      reviews: Number(reviews) || 0,

      category,
      image: image.trim(),
      description: description.trim(),
      stock: Number(stock),
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ================= GET SINGLE PRODUCT =================

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= UPDATE PRODUCT =================

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      brand,
      price,
      oldPrice,
      discount,
      rating,
      reviews,
      category,
      image,
      description,
      stock,
    } = req.body;

    // Required fields
    if (
      !name ||
      price === undefined ||
      !category ||
      !image ||
      !description ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required product fields.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        brand: brand?.trim() || "AU Fashion",

        price: Number(price),
        oldPrice: Number(oldPrice) || 0,
        discount: Number(discount) || 0,
        rating: Number(rating) || 0,
        reviews: Number(reviews) || 0,

        category,
        image: image.trim(),
        description: description.trim(),
        stock: Number(stock),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ================= DELETE PRODUCT =================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};