import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// =====================================================
// EMAIL CONFIGURATION
// =====================================================

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.trim();

console.log("========== EMAIL CONFIG ==========");
console.log("EMAIL USER EXISTS:", !!emailUser);
console.log("EMAIL PASS EXISTS:", !!emailPass);
console.log("EMAIL PASS LENGTH:", emailPass?.length || 0);
console.log("===================================");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Check SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

// =====================================================
// GENERATE OTP
// =====================================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // -------------------------------------------------
    // CHECK EXISTING USER
    // -------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    // -------------------------------------------------
    // EXISTING USER
    // -------------------------------------------------

    if (existingUser) {

      // Existing but NOT verified
      if (!existingUser.isVerified) {

        const otp = generateOTP();

        existingUser.verificationOTP = otp;

        existingUser.verificationOTPExpires = new Date(
          Date.now() + 10 * 60 * 1000
        );

        await existingUser.save();

        // Send new OTP
        await transporter.sendMail({
          from: `"AU Fashion" <${emailUser}>`,
          to: normalizedEmail,
          subject: "AU Fashion - Email Verification OTP",

          html: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              padding: 30px;
              background: #f8fafc;
              border-radius: 15px;
            ">

              <h1 style="color: #2563eb;">
                AU Fashion 👕
              </h1>

              <h2>
                Email Verification
              </h2>

              <p>
                Hello <b>${existingUser.name}</b>,
              </p>

              <p>
                We received a request to verify your AU Fashion account.
              </p>

              <p>
                Your verification OTP is:
              </p>

              <div style="
                background: #2563eb;
                color: white;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 10px;
                padding: 20px;
                text-align: center;
                border-radius: 10px;
              ">
                ${otp}
              </div>

              <p>
                This OTP will expire in
                <b>10 minutes</b>.
              </p>

              <p>
                If you did not request this verification,
                please ignore this email.
              </p>

              <br>

              <p>
                Regards,<br>
                <b>AU Fashion Team</b>
              </p>

            </div>
          `,
        });

        return res.status(200).json({
          success: true,
          message:
            "Account already exists but is not verified. New OTP sent.",
          requiresVerification: true,
          email: normalizedEmail,
        });
      }

      // Existing and already verified
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -------------------------------------------------
    // GENERATE OTP
    // -------------------------------------------------

    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,

      role: "user",

      isVerified: false,

      verificationOTP: otp,

      verificationOTPExpires: otpExpires,
    });

    // -------------------------------------------------
    // SEND VERIFICATION EMAIL
    // -------------------------------------------------

    await transporter.sendMail({
      from: `"AU Fashion" <${emailUser}>`,
      to: normalizedEmail,
      subject: "AU Fashion - Email Verification OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #f8fafc;
          border-radius: 15px;
        ">

          <h1 style="color: #2563eb;">
            AU Fashion 👕
          </h1>

          <h2>
            Welcome to AU Fashion!
          </h2>

          <p>
            Hello <b>${name}</b>,
          </p>

          <p>
            Thank you for creating your AU Fashion account.
          </p>

          <p>
            Please use the following OTP to verify your email:
          </p>

          <div style="
            background: #2563eb;
            color: white;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 10px;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in
            <b>10 minutes</b>.
          </p>

          <p>
            If you did not create this account,
            please ignore this email.
          </p>

          <br>

          <p>
            Regards,<br>
            <b>AU Fashion Team</b>
          </p>

        </div>
      `,
    });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. OTP sent to your email.",
      requiresVerification: true,
      email: normalizedEmail,
    });

  } catch (error) {

    console.error("❌ Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// VERIFY EMAIL OTP
// =====================================================

export const verifyEmailOTP = async (req, res) => {
  try {

    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    if (
      !user.verificationOTP ||
      user.verificationOTP !== otp.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // -------------------------------------------------
    // CHECK EXPIRATION
    // -------------------------------------------------

    if (
      !user.verificationOTPExpires ||
      user.verificationOTPExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP expired. Please request a new OTP.",
      });
    }

    // -------------------------------------------------
    // VERIFY USER
    // -------------------------------------------------

    user.isVerified = true;

    user.verificationOTP = undefined;

    user.verificationOTPExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {

    console.error("❌ Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// RESEND VERIFICATION OTP
// =====================================================

export const resendVerificationOTP = async (req, res) => {
  try {

    const {
      email,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // -------------------------------------------------
    // NEW OTP
    // -------------------------------------------------

    const otp = generateOTP();

    user.verificationOTP = otp;

    user.verificationOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // -------------------------------------------------
    // SEND EMAIL
    // -------------------------------------------------

    await transporter.sendMail({
      from: `"AU Fashion" <${emailUser}>`,
      to: normalizedEmail,
      subject: "AU Fashion - New Verification OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
        ">

          <h1 style="color:#2563eb;">
            AU Fashion 👕
          </h1>

          <h2>
            New Verification OTP
          </h2>

          <p>
            Your new email verification OTP is:
          </p>

          <div style="
            background:#2563eb;
            color:white;
            font-size:32px;
            font-weight:bold;
            letter-spacing:10px;
            padding:20px;
            text-align:center;
            border-radius:10px;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in
            <b>10 minutes</b>.
          </p>

          <p>
            Regards,<br>
            <b>AU Fashion Team</b>
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });

  } catch (error) {

    console.error("❌ Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter email and password",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // EMAIL VERIFICATION
    // -------------------------------------------------

    if (
      !user.isVerified &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before login",
        requiresVerification: true,
        email: user.email,
      });
    }

    // -------------------------------------------------
    // PASSWORD CHECK
    // -------------------------------------------------

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // -------------------------------------------------
    // JWT TOKEN
    // -------------------------------------------------

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("❌ Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// FORGOT PASSWORD - SEND OTP
// =====================================================

export const forgotPassword = async (req, res) => {
  try {

    const {
      email,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email",
      });
    }

    // -------------------------------------------------
    // GENERATE RESET OTP
    // -------------------------------------------------

    const otp = generateOTP();

    user.resetOTP = otp;

    user.resetOTPExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // -------------------------------------------------
    // SEND RESET EMAIL
    // -------------------------------------------------

    await transporter.sendMail({
      from: `"AU Fashion" <${emailUser}>`,
      to: normalizedEmail,
      subject: "AU Fashion - Password Reset OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
        ">

          <h1 style="color:#2563eb;">
            AU Fashion 🔐
          </h1>

          <h2>
            Password Reset
          </h2>

          <p>
            Hello <b>${user.name}</b>,
          </p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Your password reset OTP is:
          </p>

          <div style="
            background:#2563eb;
            color:white;
            font-size:32px;
            font-weight:bold;
            letter-spacing:10px;
            padding:20px;
            text-align:center;
            border-radius:10px;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in
            <b>10 minutes</b>.
          </p>

          <p>
            If you did not request a password reset,
            please ignore this email.
          </p>

          <br>

          <p>
            Regards,<br>
            <b>AU Fashion Team</b>
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset OTP sent to your email",
    });

  } catch (error) {

    console.error("❌ Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // CHECK RESET OTP
    // -------------------------------------------------

    if (
      !user.resetOTP ||
      user.resetOTP !== otp.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // -------------------------------------------------
    // CHECK EXPIRATION
    // -------------------------------------------------

    if (
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // -------------------------------------------------
    // HASH NEW PASSWORD
    // -------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    user.resetOTP = undefined;

    user.resetOTPExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login.",
    });

  } catch (error) {

    console.error("❌ Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};