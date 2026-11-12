import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // ================= GET ALL ORDERS =================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert(data.message || "Admin access required.");
          navigate("/login");
          return;
        }

        alert(data.message || "Failed to load orders.");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= UPDATE STATUS =================

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
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
        alert(data.message || "Failed to update order status.");
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order?.status || status,
              }
            : order
        )
      );

      alert("Order Status Updated Successfully! ✅");
    } catch (error) {
      console.error("Update Order Error:", error);
      alert("Server connection failed.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ================= STATUS COLOR =================

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

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="text-center">
            <div className="text-5xl mb-4">📦</div>

            <h1 className="text-3xl font-bold text-gray-700">
              Loading Orders...
            </h1>

            <p className="text-gray-500 mt-2">
              Please wait while we fetch customer orders.
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ================= COUNTS =================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  // ================= UI =================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <p className="text-blue-600 font-semibold">
                  ADMIN PANEL
                </p>

                <h1 className="text-4xl font-extrabold mt-1">
                  Order Management
                </h1>

                <p className="text-gray-500 mt-2">
                  Manage customer orders, payments and delivery status.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={fetchOrders}
                  className="bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  🔄 Refresh
                </button>

                <button
                  onClick={() => navigate("/admin")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  ← Admin Dashboard
                </button>

              </div>
            </div>
          </div>

          {/* ================= STATISTICS ================= */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8">

            {/* TOTAL */}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Total Orders
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {totalOrders}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                All orders
              </p>
            </div>

            {/* PENDING */}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Pending
              </p>

              <h2 className="text-4xl font-bold text-yellow-500 mt-2">
                {pendingOrders}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Waiting confirmation
              </p>
            </div>

            {/* CONFIRMED */}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Confirmed
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {confirmedOrders}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Confirmed orders
              </p>
            </div>

            {/* SHIPPED */}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Shipped
              </p>

              <h2 className="text-4xl font-bold text-purple-600 mt-2">
                {shippedOrders}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                On the way
              </p>
            </div>

            {/* DELIVERED */}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Delivered
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-2">
                {deliveredOrders}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Successfully delivered
              </p>
            </div>

            {/* CANCELLED */}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Cancelled
              </p>

              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {cancelledOrders}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Cancelled orders
              </p>
            </div>

          </div>

          {/* ================= ORDERS ================= */}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                All Customer Orders
              </h2>

              <p className="text-gray-500 mt-1">
                View and manage all orders placed by customers.
              </p>
            </div>

            {/* ================= NO ORDERS ================= */}

            {orders.length === 0 ? (

              <div className="p-20 text-center">

                <div className="text-6xl mb-5">
                  📦
                </div>

                <p className="text-2xl text-gray-500 font-bold">
                  No Orders Found
                </p>

                <p className="text-gray-400 mt-2">
                  Customer orders will appear here.
                </p>

              </div>

            ) : (

              /* ================= TABLE ================= */

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="text-left px-6 py-4 whitespace-nowrap">
                        Order
                      </th>

                      <th className="text-left px-6 py-4 whitespace-nowrap">
                        Customer
                      </th>

                      <th className="text-left px-6 py-4">
                        Products
                      </th>

                      <th className="text-left px-6 py-4 whitespace-nowrap">
                        Amount
                      </th>

                      <th className="text-left px-6 py-4 whitespace-nowrap">
                        Payment
                      </th>

                      <th className="text-left px-6 py-4 whitespace-nowrap">
                        Status
                      </th>

                      <th className="text-center px-6 py-4 whitespace-nowrap">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr
                        key={order._id}
                        className="border-t hover:bg-gray-50 transition"
                      >

                        {/* ================= ORDER ================= */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-gray-800">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>

                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(
                              order.createdAt
                            ).toLocaleTimeString()}
                          </p>

                        </td>

                        {/* ================= CUSTOMER ================= */}

                        <td className="px-6 py-5">

                          <p className="font-semibold">
                            {order.user?.name || "Unknown"}
                          </p>

                          <p className="text-gray-500 text-sm">
                            {order.user?.email || "No email"}
                          </p>

                          {order.user?.phone && (
                            <p className="text-gray-400 text-xs mt-1">
                              {order.user.phone}
                            </p>
                          )}

                        </td>

                        {/* ================= PRODUCTS ================= */}

                        <td className="px-6 py-5">

                          <div className="space-y-3">

                            {order.products?.map(
                              (item, index) => (

                                <div
                                  key={item.product?._id || index}
                                  className="flex items-center gap-3 min-w-[240px]"
                                >

                                  {/* IMAGE */}

                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-14 h-14 object-cover rounded-xl border"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                                      📦
                                    </div>
                                  )}

                                  {/* INFO */}

                                  <div>

                                    <p className="font-semibold text-sm">
                                      {item.name}
                                    </p>

                                    <p className="text-gray-500 text-xs mt-1">
                                      Qty: {item.quantity}
                                    </p>

                                    {item.size && (
                                      <p className="text-gray-500 text-xs">
                                        Size: {item.size}
                                      </p>
                                    )}

                                    <p className="text-gray-500 text-xs">
                                      ₹{item.price} each
                                    </p>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </td>

                        {/* ================= AMOUNT ================= */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-xl text-gray-800">
                            ₹{order.totalAmount}
                          </p>

                        </td>

                        {/* ================= PAYMENT ================= */}

                        <td className="px-6 py-5">

                          <p className="font-semibold">
                            {order.paymentMethod || "COD"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {order.paymentStatus || "Pending"}
                          </p>

                        </td>

                        {/* ================= STATUS ================= */}

                        <td className="px-6 py-5">

                          <select
                            value={order.status || "Pending"}
                            disabled={
                              updatingOrderId === order._id
                            }
                            onChange={(e) =>
                              updateStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className={`px-3 py-2 rounded-lg font-semibold border-none outline-none cursor-pointer ${getStatusClass(
                              order.status
                            )} ${
                              updatingOrderId === order._id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
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

                          {updatingOrderId === order._id && (
                            <p className="text-xs text-gray-500 mt-2">
                              Updating...
                            </p>
                          )}

                        </td>

                        {/* ================= ACTION ================= */}

                        <td className="px-6 py-5 text-center">

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order._id}`
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition"
                          >
                            👁️ View Details
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminOrders;