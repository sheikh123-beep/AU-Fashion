import { Link } from "react-router-dom";

function OrderSuccess() {
  const orderId = localStorage.getItem("latestOrderId");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">

      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 text-center max-w-2xl w-full">

        {/* SUCCESS ICON */}

        <div className="text-7xl mb-6">
          🎉
        </div>

        {/* TITLE */}

        <h1 className="text-4xl md:text-5xl font-extrabold text-green-600">
          Order Placed Successfully!
        </h1>

        {/* MESSAGE */}

        <p className="text-gray-600 mt-5 text-lg">
          Thank you for shopping with{" "}
          <span className="font-bold text-gray-900">
            AU Fashion
          </span>
          .
        </p>

        <p className="text-gray-500 mt-3">
          Your order has been received and will be processed soon.
        </p>

        {/* ORDER ID */}

        {orderId && (
          <div className="mt-8 bg-gray-50 border rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Your Order ID
            </p>

            <p className="font-bold text-lg text-gray-800 mt-2 break-all">
              #{orderId}
            </p>

          </div>
        )}

        {/* STATUS */}

        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5">

          <p className="text-green-700 font-semibold">
            ✅ Order Confirmed
          </p>

          <p className="text-green-600 text-sm mt-1">
            We will process your order shortly.
          </p>

        </div>

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

          {/* VIEW ORDER DETAILS */}

          {orderId && (
            <Link
              to={`/orders/${orderId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              📦 View Order Details
            </Link>
          )}

          {/* MY ORDERS */}

          <Link
            to="/orders"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            🛍️ My Orders
          </Link>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/products"
            className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            🛒 Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;