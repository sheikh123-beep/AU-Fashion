import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =========================
    // EMAIL VERIFICATION
    // =========================

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationOTP: {
      type: String,
    },

    verificationOTPExpires: {
      type: Date,
    },

    // =========================
    // PASSWORD RESET
    // =========================

    resetOTP: {
      type: String,
    },

    resetOTPExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;