import express from "express";

import {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= PUBLIC =================

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProductById);

// ================= ADMIN ONLY =================

// Add Product
router.post("/", protect, adminOnly, addProduct);

// Update Product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete Product
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;