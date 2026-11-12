import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =========================
  // FETCH ORDER
  // =========================

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load order.");
        navigate("/admin/orders");
        return;
      }

      setOrder(data.order);
    } catch (error) {
      console.error("Fetch Admin Order Error:", error);
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (status) => {
    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status.");
        return;
      }

      setOrder(data.order);

      alert("Order Status Updated Successfully! ✅");
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Server connection failed.");
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="text-center">
            <div className="text-5xl mb-4">
              📦
            </div>

            <h1 className="text-3xl font-bold">
              Loading Order Details...
            </h1>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!order) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-600">
            Order Not Found
          </h1>

          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            ← Back to Admin Orders
          </button>
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
        <div className="max-w-6xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <button
                  onClick={() => navigate("/admin/orders")}
                  className="text-blue-600 font-semibold mb-4"
                >
                  ← Back to Admin Orders
                </button>

                <p className="text-blue-600 font-semibold">
                  ADMIN PANEL
                </p>

                <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
                  Order Details
                </h1>

                <p className="text-gray-500 mt-2">
                  Order ID:
                  <span className="font-bold text-gray-800 ml-2 break-all">
                    #{order._id}
                  </span>
                </p>

                <p className="text-gray-500 mt-1">
                  Placed on:{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <span
                  className={`px-5 py-3 rounded-full font-bold ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

            </div>

          </div>

          {/* ================= CUSTOMER ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

            <h2 className="text-2xl font-bold mb-5">
              Customer Information
            </h2>

            <div className="grid md:grid-cols-3 gap-5">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Name
                </p>

                <p className="font-bold text-lg mt-1">
                  {order.user?.name || "Unknown"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <p className="font-bold mt-1 break-all">
                  {order.user?.email || "No email"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Phone
                </p>

                <p className="font-bold mt-1">
                  {order.user?.phone || "Not available"}
                </p>
              </div>

            </div>

          </div>

          {/* ================= PRODUCTS ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

            <h2 className="text-2xl font-bold mb-6">
              Ordered Products
            </h2>

            <div className="space-y-5">

              {order.products?.map((item, index) => (

                <div
                  key={item.product?._id || index}
                  className="flex flex-col sm:flex-row sm:items-center gap-5 border-b pb-5 last:border-b-0"
                >

                  {/* IMAGE */}

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
                      📦
                    </div>
                  )}

                  {/* INFO */}

                  <div className="flex-1">

                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Price: ₹{item.price}
                    </p>

                    <p className="text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    {item.size && (
                      <p className="text-gray-500">
                        Size: {item.size}
                      </p>
                    )}

                  </div>

                  {/* TOTAL */}

                  <div className="sm:text-right">

                    <p className="text-gray-500 text-sm">
                      Item Total
                    </p>

                    <p className="font-bold text-xl">
                      ₹
                      {Number(item.price) *
                        Number(item.quantity)}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ================= SHIPPING + PAYMENT ================= */}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">

            {/* SHIPPING */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-5">
                Shipping Address
              </h2>

              <div className="space-y-3 text-gray-600">

                <p>
                  <span className="font-semibold text-gray-800">
                    Name:
                  </span>{" "}
                  {order.shippingAddress?.name}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Phone:
                  </span>{" "}
                  {order.shippingAddress?.phone}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Address:
                  </span>{" "}
                  {order.shippingAddress?.address}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    City:
                  </span>{" "}
                  {order.shippingAddress?.city}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    State:
                  </span>{" "}
                  {order.shippingAddress?.state}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Pincode:
                  </span>{" "}
                  {order.shippingAddress?.pincode}
                </p>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-5">
                Payment Information
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Payment Method
                  </span>

                  <span className="font-bold">
                    {order.paymentMethod || "COD"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Payment Status
                  </span>

                  <span className="font-semibold">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    Total Amount
                  </span>

                  <span className="text-3xl font-extrabold text-blue-600">
                    ₹{order.totalAmount}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* ================= UPDATE STATUS ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

            <h2 className="text-2xl font-bold mb-5">
              Update Order Status
            </h2>

            <div className="flex flex-col md:flex-row gap-4">

              <select
                value={order.status || "Pending"}
                disabled={updating}
                onChange={(e) =>
                  updateStatus(e.target.value)
                }
                className={`flex-1 px-5 py-4 rounded-xl font-bold border-none outline-none ${getStatusClass(
                  order.status
                )} ${
                  updating
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              {updating && (
                <div className="flex items-center justify-center px-5 text-gray-500 font-semibold">
                  Updating...
                </div>
              )}

            </div>

            {/* STATUS FLOW */}

            <div className="mt-6">

              <p className="text-gray-500 mb-3">
                Order Progress
              </p>

              <div className="flex flex-wrap gap-3">

                {[
                  "Pending",
                  "Confirmed",
                  "Shipped",
                  "Delivered",
                ].map((status) => (

                  <div
                    key={status}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      order.status === status
                        ? getStatusClass(status)
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {status}
                  </div>

                ))}

              </div>

              {order.status === "Cancelled" && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-semibold">
                  ❌ This order has been cancelled.
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminOrderDetails;