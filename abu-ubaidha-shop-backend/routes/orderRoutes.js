import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Order
router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

// Get All Orders - Admin Only
router.get("/all", protect, adminOnly, getAllOrders);

// Get Single Order
router.get("/:id", protect, getOrderById);

// Update Order Status - Admin Only
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;