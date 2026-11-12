import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH MY ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          data.message || "Failed to load orders."
        );
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);

      setError(
        "Server connection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Confirmed":
        return "bg-purple-100 text-purple-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex justify-center items-center h-[60vh]">
          <h1 className="text-3xl font-bold">
            Loading Orders...
          </h1>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-6">

        <div className="max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

              <div>

                <p className="text-blue-600 font-semibold">
                  MY ACCOUNT
                </p>

                <h1 className="text-4xl font-extrabold mt-1">
                  My Orders
                </h1>

                <p className="text-gray-500 mt-2">
                  View your order history and current
                  delivery status.
                </p>

              </div>

              <button
                onClick={fetchOrders}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                🔄 Refresh Orders
              </button>

            </div>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 mb-8">

              <p className="font-semibold">
                {error}
              </p>

              <button
                onClick={fetchOrders}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>

            </div>
          )}

          {/* ================= NO ORDERS ================= */}

          {!error && orders.length === 0 && (

            <div className="bg-white shadow-lg rounded-2xl p-16 text-center">

              <div className="text-6xl mb-5">
                📦
              </div>

              <h2 className="text-3xl font-bold text-gray-500">
                No Orders Found
              </h2>

              <p className="text-gray-400 mt-3">
                You haven't placed any orders yet.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Start Shopping
              </button>

            </div>
          )}

          {/* ================= ORDERS ================= */}

          {!error && orders.length > 0 && (

            <div className="space-y-6">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >

                  {/* ================= ORDER HEADER ================= */}

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-5">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-bold">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <div>

                      <span
                        className={`px-4 py-2 rounded-full font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                  </div>

                  {/* ================= PRODUCTS ================= */}

                  <div className="mt-6">

                    <h3 className="font-bold text-xl mb-4">
                      Ordered Products
                    </h3>

                    <div className="space-y-4">

                      {order.products?.map(
                        (item, index) => (

                          <div
                            key={
                              item.product?._id ||
                              index
                            }
                            className="flex flex-col sm:flex-row sm:items-center gap-5 border-b pb-4"
                          >

                            {/* IMAGE */}

                            <img
                              src={
                                item.image ||
                                item.product?.image
                              }
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl"
                            />

                            {/* INFO */}

                            <div className="flex-1">

                              <h3 className="font-bold text-lg">
                                {item.name}
                              </h3>

                              <p className="text-gray-500">
                                Quantity:{" "}
                                {item.quantity}
                              </p>

                              {item.size && (
                                <p className="text-gray-500">
                                  Size: {item.size}
                                </p>
                              )}

                            </div>

                            {/* PRICE */}

                            <div className="text-right">

                              <p className="text-gray-500 text-sm">
                                ₹{item.price} ×{" "}
                                {item.quantity}
                              </p>

                              <p className="font-bold text-lg">
                                ₹
                                {Number(item.price) *
                                  Number(item.quantity)}
                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* ================= SHIPPING ================= */}

                  {order.shippingAddress && (

                    <div className="mt-6 bg-gray-50 rounded-xl p-5">

                      <h3 className="font-bold text-lg mb-3">
                        Delivery Address
                      </h3>

                      <p className="font-semibold">
                        {order.shippingAddress.name}
                      </p>

                      <p className="text-gray-600">
                        {order.shippingAddress.address}
                      </p>

                      <p className="text-gray-600">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>

                      <p className="text-gray-600">
                        Phone:{" "}
                        {order.shippingAddress.phone}
                      </p>

                    </div>

                  )}

                  {/* ================= ORDER FOOTER ================= */}

                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mt-6 pt-5 border-t">

                    {/* PAYMENT */}

                    <div>

                      <p className="text-gray-500">
                        Payment Method
                      </p>

                      <p className="font-semibold">
                        {order.paymentMethod}
                      </p>

                      <p className="text-sm text-gray-500">
                        Payment Status:{" "}
                        {order.paymentStatus || "Pending"}
                      </p>

                    </div>

                    {/* TOTAL + VIEW DETAILS */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                      <div className="md:text-right">

                        <p className="text-gray-500">
                          Total Amount
                        </p>

                        <p className="text-3xl font-extrabold text-blue-600">
                          ₹{order.totalAmount}
                        </p>

                      </div>

                      {/* ================= VIEW DETAILS ================= */}

                      <button
                        onClick={() =>
                          navigate(`/orders/${order._id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Orders;