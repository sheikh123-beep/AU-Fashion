import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET MY PROFILE
router.get("/profile", protect, getMyProfile);

// UPDATE MY PROFILE
router.put("/profile", protect, updateMyProfile);
// CHANGE PASSWORD
router.put("/change-password", protect, changePassword);

export default router;