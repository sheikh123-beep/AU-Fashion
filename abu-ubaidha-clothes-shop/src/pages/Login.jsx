import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      // Check response
      if (!data.success) {
        alert(data.message || "Login Failed");
        return;
      }

      // =========================
      // SAVE JWT TOKEN
      // =========================

      localStorage.setItem(
        "token",
        data.token
      );

      // =========================
      // SAVE USER
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // =========================
      // UPDATE AUTH CONTEXT
      // =========================

      login(data.user);

      alert(`Welcome ${data.user.name} 🎉`);

      // =========================
      // ADMIN / USER REDIRECT
      // =========================

      if (data.user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/profile");
}

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.response?.data?.message ||
        "Login Failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        {/* Logo */}

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
            Welcome Back 👋
          </p>

        </div>

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >

          {/* Email */}

          <div>

            <label className="font-semibold">
              Email
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaEnvelope className="mr-3 text-gray-500" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="outline-none w-full"
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="font-semibold">
              Password
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

              <FaLock className="mr-3 text-gray-500" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="outline-none w-full"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
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

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl font-bold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* Register */}

        <p className="text-center mt-6 text-gray-600">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 font-semibold ml-2 hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;