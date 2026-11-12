import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(
    user?.name || ""
  );

  const [phone, setPhone] = useState(
    user?.phone || ""
  );

  const [loading, setLoading] = useState(false);

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.put(
        "/auth/profile",
        {
          name: name.trim(),
          phone: phone.trim(),
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully! 🎉");

        // Update local storage user
        const currentUser =
          JSON.parse(
            localStorage.getItem("user")
          ) || {};

        const updatedUser = {
          ...currentUser,
          name: response.data.user.name,
          phone: response.data.user.phone,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        // Reload so AuthContext gets updated data
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // =====================================================
  // NO USER
  // =====================================================

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex items-center justify-center">

          <div className="text-center">

            <h2 className="text-2xl font-bold mb-4">
              Please login first
            </h2>

            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              Login
            </button>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-14 px-6">

        <div className="max-w-5xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="text-center mb-10">

            <h1 className="text-4xl font-extrabold text-gray-900">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your AU Fashion account
            </p>

          </div>

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* PROFILE HEADER */}

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white">

              <div className="flex flex-col md:flex-row items-center gap-6">

                {/* AVATAR */}

                <div className="w-28 h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-5xl font-extrabold shadow-xl">

                  {userInitial}

                </div>

                <div className="text-center md:text-left">

                  <h2 className="text-3xl font-bold">
                    {user.name}
                  </h2>

                  <p className="text-blue-100 mt-1">
                    {user.email}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">

                    <FaShieldAlt />

                    {user.role === "admin"
                      ? "Administrator"
                      : "Customer"}

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                PROFILE BODY
            ================================================= */}

            <div className="p-8 md:p-10">

              {!editing ? (

                <div className="space-y-6">

                  {/* NAME */}

                  <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl">

                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">

                      <FaUser />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Full Name
                      </p>

                      <p className="text-lg font-semibold">
                        {user.name}
                      </p>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl">

                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">

                      <FaEnvelope />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Email Address
                      </p>

                      <p className="text-lg font-semibold break-all">
                        {user.email}
                      </p>

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl">

                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">

                      <FaPhone />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Phone Number
                      </p>

                      <p className="text-lg font-semibold">
                        {user.phone || "Not added"}
                      </p>

                    </div>

                  </div>

                  {/* ROLE */}

                  <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl">

                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">

                      <FaShieldAlt />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Account Type
                      </p>

                      <p className="text-lg font-semibold capitalize">
                        {user.role}
                      </p>

                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">

                    <button
                      onClick={() =>
                        setEditing(true)
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                    >

                      <FaEdit />

                      Edit Profile

                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                    >

                      <FaSignOutAlt />

                      Logout

                    </button>

                  </div>

                </div>

              ) : (

                /* =================================================
                   EDIT FORM
                ================================================= */

                <form
                  onSubmit={handleUpdate}
                  className="space-y-6"
                >

                  <div>

                    <label className="font-semibold">
                      Full Name
                    </label>

                    <div className="flex items-center border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500">

                      <FaUser className="text-gray-500 mr-3" />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        className="outline-none w-full"
                        placeholder="Enter your name"
                      />

                    </div>

                  </div>

                  {/* EMAIL READ ONLY */}

                  <div>

                    <label className="font-semibold">
                      Email
                    </label>

                    <div className="flex items-center border rounded-xl px-4 py-3 mt-2 bg-gray-100">

                      <FaEnvelope className="text-gray-500 mr-3" />

                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="outline-none w-full bg-transparent text-gray-500"
                      />

                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Email cannot be changed from this page.
                    </p>

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
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        className="outline-none w-full"
                        placeholder="Enter your phone number"
                      />

                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >

                      <FaSave />

                      {loading
                        ? "Saving..."
                        : "Save Changes"}

                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setName(user.name || "");
                        setPhone(user.phone || "");
                        setEditing(false);
                      }}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >

                      <FaTimes />

                      Cancel

                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Profile;