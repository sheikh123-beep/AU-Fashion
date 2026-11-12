import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      const data = response.data;

      if (data.requiresVerification) {
        setVerifiedEmail(data.email);
        setOtpMode(true);

        alert(
          "Registration successful! Verification OTP has been sent to your email."
        );

        return;
      }

      alert(data.message);

      navigate("/login");

    } catch (error) {
      console.error("Register Error:", error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setOtpLoading(true);

      const response = await API.post(
        "/auth/verify-email",
        {
          email: verifiedEmail,
          otp: otp,
        }
      );

      const data = response.data;

      if (data.success) {
        alert(
          "Email verified successfully! 🎉"
        );

        navigate("/login");
      }

    } catch (error) {
      console.error("OTP Error:", error);

      alert(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOTP = async () => {
    try {
      setOtpLoading(true);

      const response = await API.post(
        "/auth/resend-verification",
        {
          email: verifiedEmail,
        }
      );

      alert(response.data.message);

    } catch (error) {
      console.error("Resend OTP Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // =====================================================
  // OTP SCREEN
  // =====================================================

  if (otpMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6">

        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

          <div className="text-center">

            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaKey className="text-2xl" />
            </div>

            <h1 className="text-3xl font-extrabold">

              <span className="text-black">
                AU
              </span>

              <span className="text-blue-600">
                {" "}Fashion
              </span>

            </h1>

            <p className="text-gray-500 mt-3">
              Verify Your Email
            </p>

            <p className="text-sm text-gray-500 mt-4">
              We sent a 6-digit verification code to
            </p>

            <p className="font-semibold text-gray-800 mt-1 break-all">
              {verifiedEmail}
            </p>

          </div>

          <form
            onSubmit={handleVerifyOTP}
            className="mt-8"
          >

            <label className="font-semibold">
              Enter OTP
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaKey className="text-gray-500 mr-3" />

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="Enter 6-digit OTP"
                className="outline-none w-full text-center text-xl tracking-[0.5em] font-bold"
              />

            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold transition"
            >
              {otpLoading
                ? "Verifying..."
                : "Verify Email"}
            </button>

          </form>

          <div className="text-center mt-6">

            <p className="text-gray-500 text-sm">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={otpLoading}
              className="text-blue-600 font-semibold hover:underline mt-1"
            >
              Resend OTP
            </button>

          </div>

          <button
            type="button"
            onClick={() => {
              setOtpMode(false);
              setOtp("");
            }}
            className="w-full mt-5 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition"
          >
            Back to Registration
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // REGISTER SCREEN
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">

        <div className="text-center">

          <h1 className="text-4xl font-extrabold">

            <span className="text-black">
              AU
            </span>

            <span className="text-blue-600">
              {" "}Fashion
            </span>

          </h1>

          <p className="text-gray-500 mt-2">
            Create Your Account 🚀
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="font-semibold">
              Full Name
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaUser className="text-gray-500 mr-3" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="outline-none w-full"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div>

            <label className="font-semibold">
              Email
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaEnvelope className="text-gray-500 mr-3" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="outline-none w-full"
                autoComplete="email"
              />

            </div>

          </div>

          {/* PHONE */}

          <div>

            <label className="font-semibold">
              Phone Number
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaPhone className="text-gray-500 mr-3" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="outline-none w-full"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label className="font-semibold">
              Password
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaLock className="text-gray-500 mr-3" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="outline-none w-full"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="text-gray-600 hover:text-blue-600"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <label className="font-semibold">
              Confirm Password
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaLock className="text-gray-500 mr-3" />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="outline-none w-full"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
                className="text-gray-600 hover:text-blue-600"
              >
                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* TERMS */}

          <label className="flex items-center gap-2 text-sm">

            <input
              type="checkbox"
              required
            />

            I agree to the Terms & Conditions

          </label>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="text-center mt-8 text-gray-600">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;