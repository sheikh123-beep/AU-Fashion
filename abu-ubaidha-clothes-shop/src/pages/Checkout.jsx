import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();

  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "COD",
  });

  // =========================
  // PRICE CALCULATION
  // =========================

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const delivery = subtotal > 0 ? 99 : 0;

  const gst = Math.round(subtotal * 0.18);

  const total = subtotal + delivery + gst;

  // =========================
  // EMPTY CART CHECK
  // =========================

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart, navigate]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async () => {
    // =========================
    // CART CHECK
    // =========================

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    // =========================
    // SHIPPING VALIDATION
    // =========================

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      alert("Please fill all shipping details.");
      return;
    }

    // =========================
    // PHONE VALIDATION
    // =========================

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // =========================
    // PINCODE VALIDATION
    // =========================

    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setPlacingOrder(true);

      // =========================
      // GET TOKEN
      // =========================

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login before placing an order.");
        navigate("/login");
        return;
      }

      // =========================
      // PREPARE PRODUCTS
      // =========================

      const orderProducts = cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size || "M",
      }));

      // =========================
      // PAYMENT METHOD
      // =========================

      let paymentMethod = "COD";

      if (formData.payment === "UPI") {
        paymentMethod = "Online";
      }

      if (formData.payment === "CARD") {
        paymentMethod = "Online";
      }

      // =========================
      // CREATE ORDER
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            products: orderProducts,

            totalAmount: total,

            shippingAddress: {
              name: formData.name.trim(),
              phone: formData.phone.trim(),
              address: formData.address.trim(),
              city: formData.city.trim(),
              state: formData.state.trim(),
              pincode: formData.pincode.trim(),
            },

            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      // =========================
      // BACKEND ERROR
      // =========================

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to create order."
        );

        return;
      }

      // =========================
      // ORDER SUCCESS
      // =========================

      console.log(
        "Order Created Successfully:",
        data.order
      );

      // Save latest order ID
      localStorage.setItem(
        "latestOrderId",
        data.order._id
      );

      // Clear cart
      clearCart();

      // Go to success page
      navigate("/order-success");

    } catch (error) {
      console.error(
        "Place Order Error:",
        error
      );

      alert(
        "Server connection failed. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-6">

        <div className="max-w-7xl mx-auto">

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-8">

            <p className="text-blue-600 font-semibold">
              AU FASHION
            </p>

            <h1 className="text-4xl font-extrabold mt-1">
              Checkout
            </h1>

            <p className="text-gray-500 mt-2">
              Complete your shipping and payment details.
            </p>

          </div>

          {/* =========================
              MAIN GRID
          ========================= */}

          <div className="grid lg:grid-cols-3 gap-8">

            {/* =========================
                LEFT - SHIPPING
            ========================= */}

            <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-8">

              <h2 className="text-2xl font-bold mb-6">
                Shipping Address
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>
                  <label className="font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    className="border p-3 rounded-xl w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="font-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    onChange={handleChange}
                    className="border p-3 rounded-xl w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="font-semibold">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder="Enter city"
                    onChange={handleChange}
                    className="border p-3 rounded-xl w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* STATE */}

                <div>
                  <label className="font-semibold">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    placeholder="Enter state"
                    onChange={handleChange}
                    className="border p-3 rounded-xl w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label className="font-semibold">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    onChange={handleChange}
                    className="border p-3 rounded-xl w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* ADDRESS */}

              <div className="mt-5">

                <label className="font-semibold">
                  Full Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  placeholder="House number, street, area..."
                  rows="4"
                  onChange={handleChange}
                  className="border p-3 rounded-xl w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* =========================
                  PAYMENT
              ========================= */}

              <h2 className="text-2xl font-bold mt-8 mb-4">
                Payment Method
              </h2>

              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="border p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="COD">
                  Cash on Delivery
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="CARD">
                  Credit / Debit Card
                </option>

              </select>

              {/* PAYMENT NOTE */}

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">

                {formData.payment === "COD" && (
                  <p className="text-blue-700 font-medium">
                    💵 You will pay when your order is delivered.
                  </p>
                )}

                {formData.payment === "UPI" && (
                  <p className="text-blue-700 font-medium">
                    📱 UPI payment will be processed as an online payment.
                  </p>
                )}

                {formData.payment === "CARD" && (
                  <p className="text-blue-700 font-medium">
                    💳 Card payment will be processed as an online payment.
                  </p>
                )}

              </div>

            </div>

            {/* =========================
                RIGHT - SUMMARY
            ========================= */}

            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              {/* PRODUCTS */}

              <div className="space-y-4 mb-6">

                {cart.map((item, index) => (

                  <div
                    key={item._id || item.id || index}
                    className="flex items-center gap-3"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />

                    <div className="flex-1">

                      <p className="font-semibold text-sm">
                        {item.name}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-semibold">
                      ₹
                      {Number(item.price) *
                        Number(item.quantity)}
                    </p>

                  </div>

                ))}

              </div>

              <hr />

              {/* SUBTOTAL */}

              <div className="flex justify-between mt-5 mb-3">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹{subtotal}
                </span>
              </div>

              {/* DELIVERY */}

              <div className="flex justify-between mb-3">

                <span className="text-gray-600">
                  Delivery
                </span>

                <span className="font-semibold">
                  ₹{delivery}
                </span>

              </div>

              {/* GST */}

              <div className="flex justify-between mb-4">

                <span className="text-gray-600">
                  GST (18%)
                </span>

                <span className="font-semibold">
                  ₹{gst}
                </span>

              </div>

              <hr />

              {/* TOTAL */}

              <div className="flex justify-between text-2xl font-bold mt-5">

                <span>
                  Total
                </span>

                <span className="text-blue-600">
                  ₹{total}
                </span>

              </div>

              {/* PLACE ORDER */}

              <button
                onClick={placeOrder}
                disabled={placingOrder || cart.length === 0}
                className={`w-full mt-8 text-white py-4 rounded-xl font-bold text-lg transition ${
                  placingOrder || cart.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >

                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}

              </button>

              {/* BACK */}

              <button
                onClick={() => navigate("/cart")}
                disabled={placingOrder}
                className="w-full mt-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold"
              >
                ← Back to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Checkout;