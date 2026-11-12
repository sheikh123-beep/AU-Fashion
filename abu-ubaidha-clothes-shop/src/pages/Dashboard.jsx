import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { cart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await API.get("/orders/my-orders");

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("Dashboard Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // =====================================================
  // ORDER STATISTICS
  // =====================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase();

    return (
      status === "pending" ||
      status === "processing" ||
      status === "confirmed"
    );
  }).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered"
  ).length;

  const totalSpent = orders.reduce(
    (total, order) =>
      total +
      Number(
        order.totalPrice ||
          order.total ||
          0
      ),
    0
  );

  const cartItems = cart.reduce(
    (total, item) =>
      total + (item.quantity || 1),
    0
  );

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

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
  // DASHBOARD
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-6">

        <div className="max-w-7xl mx-auto">

          {/* =================================================
              WELCOME HEADER
          ================================================= */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-xl p-8 md:p-10 text-white mb-8">

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-extrabold shadow-lg">

                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}

                </div>

                <div>

                  <p className="text-blue-100">
                    Welcome back 👋
                  </p>

                  <h1 className="text-3xl md:text-4xl font-extrabold">
                    {user?.name || "User"}
                  </h1>

                  <p className="text-blue-100 mt-1">
                    {user?.email}
                  </p>

                </div>

              </div>

              <button
                onClick={() => navigate("/profile")}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
              >
                👤 My Profile
              </button>

            </div>

          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* TOTAL ORDERS */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Total Orders
                  </p>

                  <h2 className="text-3xl font-extrabold mt-2">
                    {totalOrders}
                  </h2>

                </div>

                <div className="text-4xl">
                  📦
                </div>

              </div>

            </div>

            {/* PENDING */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Pending Orders
                  </p>

                  <h2 className="text-3xl font-extrabold mt-2">
                    {pendingOrders}
                  </h2>

                </div>

                <div className="text-4xl">
                  ⏳
                </div>

              </div>

            </div>

            {/* DELIVERED */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Delivered
                  </p>

                  <h2 className="text-3xl font-extrabold mt-2">
                    {deliveredOrders}
                  </h2>

                </div>

                <div className="text-4xl">
                  ✅
                </div>

              </div>

            </div>

            {/* TOTAL SPENT */}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    Total Spent
                  </p>

                  <h2 className="text-2xl font-extrabold mt-2">
                    ₹{totalSpent.toLocaleString()}
                  </h2>

                </div>

                <div className="text-4xl">
                  💰
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

            <h2 className="text-2xl font-bold mb-6">
              ⚡ Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <button
                onClick={() => navigate("/products")}
                className="p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition text-left"
              >
                <div className="text-3xl mb-3">
                  🛍️
                </div>

                <h3 className="font-bold text-lg">
                  Shop Products
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Explore our latest collection
                </p>
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="p-6 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition text-left"
              >
                <div className="text-3xl mb-3">
                  📦
                </div>

                <h3 className="font-bold text-lg">
                  My Orders
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Track your orders
                </p>
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="p-6 rounded-2xl bg-pink-50 hover:bg-pink-100 transition text-left"
              >
                <div className="text-3xl mb-3">
                  ❤️
                </div>

                <h3 className="font-bold text-lg">
                  Wishlist
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View your saved products
                </p>
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition text-left"
              >
                <div className="text-3xl mb-3">
                  🛒
                </div>

                <h3 className="font-bold text-lg">
                  My Cart
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {cartItems} item
                  {cartItems !== 1 ? "s" : ""} in cart
                </p>
              </button>

            </div>

          </div>

          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

              <h2 className="text-2xl font-bold">
                📦 Recent Orders
              </h2>

              <button
                onClick={() => navigate("/orders")}
                className="text-blue-600 font-semibold hover:underline"
              >
                View All →
              </button>

            </div>

            {loading ? (

              <div className="text-center py-10 text-gray-500">
                Loading orders...
              </div>

            ) : orders.length === 0 ? (

              <div className="text-center py-12">

                <div className="text-6xl mb-4">
                  🛍️
                </div>

                <h3 className="text-xl font-bold">
                  No orders yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Start shopping and your orders
                  will appear here.
                </p>

                <button
                  onClick={() => navigate("/products")}
                  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
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

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

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

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Processing"}
                        </span>

                        <p className="font-bold text-lg">
                          ₹
                          {Number(
                            order.totalPrice ||
                              order.total ||
                              0
                          ).toLocaleString()}
                        </p>

                        <button
                          onClick={() =>
                            navigate(
                              `/orders/${order._id}`
                            )
                          }
                          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-xl font-semibold transition"
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

      </main>

      <Footer />
    </>
  );
}

export default Dashboard;