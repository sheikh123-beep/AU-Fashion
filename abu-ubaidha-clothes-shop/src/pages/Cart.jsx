import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 99 : 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <h2 className="text-xl">
            Your cart is empty.
          </h2>
        ) : (

          <div className="grid lg:grid-cols-3 gap-10">

            {/* Cart Items */}

            <div className="lg:col-span-2">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between items-center border rounded-xl p-5 mb-5 shadow-sm"
                >

                  <div>

                    <h2 className="font-bold text-lg">
                      {item.name}
                    </h2>

                    <p className="text-blue-600 font-semibold">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center gap-3 mt-3">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            {/* Order Summary */}

            <div className="bg-gray-50 rounded-2xl shadow-lg p-6 h-fit">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Delivery</span>
                <span>₹{delivery}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}

export default Cart;