import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import API from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const { user, login } = useAuth();
  const { cart } = useCart();

  // =====================================================
  // PROFILE
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // =====================================================
  // PASSWORD
  // =====================================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordBox, setShowPasswordBox] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  // =====================================================
  // ORDERS
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(true);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await API.get(
          "/orders/my-orders"
        );

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setOrders(response.data.orders || []);
        }

      } catch (error) {
        console.error(
          "Dashboard Orders Error:",
          error
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // =====================================================
  // PROFILE INPUT
  // =====================================================

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required.");
      return;
    }

    try {
      setProfileLoading(true);

      const response = await API.put(
        "/users/profile",
        {
          name: formData.name,
          phone: formData.phone,
        }
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        login(data.user);

        alert(
          "Profile updated successfully! 🎉"
        );

        setEditing(false);
      }

    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // CANCEL PROFILE EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });

    setEditing(false);
  };

  // =====================================================
  // PASSWORD INPUT
  // =====================================================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (
      passwordData.newPassword.length < 6
    ) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await API.put(
        "/users/change-password",
        {
          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword,
        }
      );

      if (response.data.success) {
        alert(
          "Password changed successfully! 🔐"
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowPasswordBox(false);
      }

    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const getStatusStyle = (status) => {
    const value =
      status?.toLowerCase();

    if (value === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      value === "shipped" ||
      value === "out for delivery"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-6">

        <div className="max-w-6xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8">

            <div className="flex flex-col md:flex-row items-center gap-6">

              <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">

                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              <div className="text-center md:text-left">

                <p className="text-blue-100">
                  Welcome back 👋
                </p>

                <h1 className="text-4xl font-extrabold mt-1">
                  {user?.name || "User"}
                </h1>

                <p className="text-blue-100 mt-2">
                  {user?.email}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* ORDERS */}

            <button
              onClick={() => navigate("/orders")}
              className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl hover:-translate-y-1 transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    My Orders
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {orders.length}
                  </p>

                </div>

                <div className="text-4xl">
                  📦
                </div>

              </div>

            </button>

            {/* CART */}

            <button
              onClick={() => navigate("/cart")}
              className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl hover:-translate-y-1 transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Cart Items
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {cart.reduce(
                      (total, item) =>
                        total +
                        (item.quantity || 1),
                      0
                    )}
                  </p>

                </div>

                <div className="text-4xl">
                  🛒
                </div>

              </div>

            </button>

            {/* WISHLIST */}

            <button
              onClick={() =>
                navigate("/wishlist")
              }
              className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl hover:-translate-y-1 transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Wishlist
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    ❤️
                  </p>

                </div>

                <div className="text-4xl">
                  ❤️
                </div>

              </div>

            </button>

          </div>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold">
                👤 Personal Information
              </h2>

              {!editing && (
                <button
                  onClick={() =>
                    setEditing(true)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                >
                  ✏️ Edit
                </button>
              )}

            </div>

            {editing ? (

              <form
                onSubmit={handleProfileSubmit}
                className="space-y-5"
              >

                <div>

                  <label className="font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={
                      handleProfileChange
                    }
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                <div>

                  <label className="font-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-gray-100 border rounded-xl px-4 py-3 mt-2 text-gray-500"
                  />

                </div>

                <div>

                  <label className="font-semibold">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={
                      handleProfileChange
                    }
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                <div className="flex gap-4">

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    {profileLoading
                      ? "Saving..."
                      : "💾 Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    className="border px-6 py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-gray-50 p-5 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Full Name
                  </p>
                  <p className="font-semibold text-lg mt-1">
                    {user?.name}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Email
                  </p>
                  <p className="font-semibold text-lg mt-1 break-all">
                    {user?.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Phone
                  </p>
                  <p className="font-semibold text-lg mt-1">
                    {user?.phone || "Not added"}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    Account Type
                  </p>
                  <p className="font-semibold text-lg mt-1 capitalize">
                    {user?.role || "user"}
                  </p>
                </div>

              </div>

            )}

          </div>

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  🔐 Security
                </h2>

                <p className="text-gray-500 mt-1">
                  Manage your account password
                </p>

              </div>

              <button
                onClick={() =>
                  setShowPasswordBox(
                    !showPasswordBox
                  )
                }
                className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold"
              >
                🔑 Change Password
              </button>

            </div>

            {showPasswordBox && (

              <form
                onSubmit={
                  handleChangePassword
                }
                className="mt-8 space-y-5 border-t pt-8"
              >

                <div>

                  <label className="font-semibold">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />

                </div>

                <div>

                  <label className="font-semibold">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />

                </div>

                <div>

                  <label className="font-semibold">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />

                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold"
                >
                  {passwordLoading
                    ? "Changing..."
                    : "🔐 Update Password"}
                </button>

              </form>

            )}

          </div>

          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                📦 Recent Orders
              </h2>

              <button
                onClick={() =>
                  navigate("/orders")
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                View All →
              </button>

            </div>

            {ordersLoading ? (

              <div className="text-center py-10 text-gray-500">
                Loading orders...
              </div>

            ) : orders.length === 0 ? (

              <div className="text-center py-10">

                <div className="text-5xl mb-4">
                  📦
                </div>

                <p className="text-gray-500">
                  You haven't placed any orders yet.
                </p>

                <button
                  onClick={() =>
                    navigate("/products")
                  }
                  className="mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                >
                  Start Shopping
                </button>

              </div>

            ) : (

              <div className="space-y-4">

                {orders
                  .slice(0, 5)
                  .map((order) => (

                    <div
                      key={order._id}
                      className="border rounded-2xl p-5 hover:shadow-md transition"
                    >

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div>

                          <p className="font-bold">
                            Order #
                            {order._id
                              ?.slice(-8)
                              .toUpperCase()}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString()
                              : "Date unavailable"}
                          </p>

                        </div>

                        <div>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status ||
                              "Processing"}
                          </span>

                        </div>

                        <div className="font-bold text-lg">
                          ₹
                          {Number(
                            order.totalPrice ||
                              order.total ||
                              0
                          ).toLocaleString()}
                        </div>

                        <button
                          onClick={() =>
                            navigate(
                              `/orders/${order._id}`
                            )
                          }
                          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl font-semibold transition"
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Profile;