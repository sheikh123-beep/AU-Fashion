import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  // =========================
  // FETCH PRODUCT
  // =========================

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Product not found.");
        return;
      }

      setProduct(data.product);

      // Reset quantity when product loads
      setQuantity(1);
    } catch (error) {
      console.error("Fetch Product Error:", error);

      setError(
        "Server connection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // =========================
  // QUANTITY
  // =========================

  const increaseQuantity = () => {
    if (!product) return;

    if (quantity < Number(product.stock)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (!product) return;

    if (Number(product.stock) <= 0) {
      alert("Product is out of stock.");
      return;
    }

    addToCart(product, quantity);

    alert("Product added to cart successfully! 🛒");

    navigate("/cart");
  };

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = () => {
    if (!product) return;

    if (Number(product.stock) <= 0) {
      alert("Product is out of stock.");
      return;
    }

    addToCart(product, quantity);

    // Buy Now → Checkout
    navigate("/checkout");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex justify-center items-center">
          <h1 className="text-3xl font-bold">
            Loading Product...
          </h1>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !product) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex flex-col justify-center items-center px-6">
          <h1 className="text-3xl font-bold text-gray-600">
            {error || "Product Not Found"}
          </h1>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Products
          </button>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // STOCK STATUS
  // =========================

  const isOutOfStock = Number(product.stock) <= 0;

  // =========================
  // UI
  // =========================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-6">

        <div className="max-w-7xl mx-auto">

          {/* =========================
              BACK BUTTON
          ========================= */}

          <button
            onClick={() => navigate("/products")}
            className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Products
          </button>

          {/* =========================
              PRODUCT
          ========================= */}

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <div className="grid lg:grid-cols-2">

              {/* =========================
                  IMAGE
              ========================= */}

              <div className="bg-gray-50 p-8 flex items-center justify-center">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-xl h-[500px] object-cover rounded-2xl shadow-lg"
                />

              </div>

              {/* =========================
                  DETAILS
              ========================= */}

              <div className="p-8 lg:p-12">

                {/* BRAND */}

                <p className="text-blue-600 font-semibold uppercase tracking-wide">
                  {product.brand || "AU Fashion"}
                </p>

                {/* NAME */}

                <h1 className="text-4xl font-extrabold mt-2">
                  {product.name}
                </h1>

                {/* CATEGORY */}

                <p className="text-gray-500 mt-3">
                  Category:{" "}
                  <span className="font-semibold text-gray-700">
                    {product.category}
                  </span>
                </p>

                {/* RATING */}

                {Number(product.rating) > 0 && (
                  <div className="flex items-center gap-2 mt-4">

                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-semibold">
                      ⭐ {product.rating}
                    </span>

                    <span className="text-gray-500">
                      {product.reviews || 0} Reviews
                    </span>

                  </div>
                )}

                {/* PRICE */}

                <div className="mt-6">

                  <div className="flex items-center gap-4">

                    <span className="text-4xl font-extrabold text-blue-600">
                      ₹{product.price}
                    </span>

                    {Number(product.oldPrice) > 0 && (
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.oldPrice}
                      </span>
                    )}

                  </div>

                  {Number(product.discount) > 0 && (
                    <p className="text-green-600 font-semibold mt-2">
                      {product.discount}% OFF
                    </p>
                  )}

                </div>

                {/* DESCRIPTION */}

                <div className="mt-8">

                  <h2 className="text-xl font-bold mb-3">
                    Product Description
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                </div>

                {/* STOCK */}

                <div className="mt-6">

                  {isOutOfStock ? (
                    <p className="text-red-600 font-bold text-lg">
                      Out of Stock
                    </p>
                  ) : (
                    <p className="text-green-600 font-semibold">
                      In Stock: {product.stock} available
                    </p>
                  )}

                </div>

                {/* =========================
                    QUANTITY
                ========================= */}

                {!isOutOfStock && (
                  <div className="mt-6">

                    <p className="font-semibold mb-2">
                      Quantity
                    </p>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-11 h-11 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-xl disabled:opacity-50"
                      >
                        −
                      </button>

                      <span className="w-12 text-center text-xl font-bold">
                        {quantity}
                      </span>

                      <button
                        onClick={increaseQuantity}
                        disabled={
                          quantity >= Number(product.stock)
                        }
                        className="w-11 h-11 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-xl disabled:opacity-50"
                      >
                        +
                      </button>

                    </div>

                  </div>
                )}

                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="mt-8 grid sm:grid-cols-2 gap-4">

                  {/* ADD TO CART */}

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="bg-gray-900 hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition"
                  >
                    🛒 Add to Cart
                  </button>

                  {/* BUY NOW */}

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition"
                  >
                    ⚡ Buy Now
                  </button>

                </div>

                {/* =========================
                    EXTRA INFORMATION
                ========================= */}

                <div className="mt-8 grid sm:grid-cols-3 gap-4">

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <div className="text-2xl">
                      🚚
                    </div>

                    <p className="font-semibold mt-2">
                      Fast Delivery
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Quick delivery
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <div className="text-2xl">
                      🔒
                    </div>

                    <p className="font-semibold mt-2">
                      Secure Payment
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Safe checkout
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <div className="text-2xl">
                      ↩️
                    </div>

                    <p className="font-semibold mt-2">
                      Easy Returns
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Simple returns
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;