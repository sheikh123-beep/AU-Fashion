import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const productId = product._id;

  const rating = product.rating || 4.5;
  const reviews = product.reviews || 0;

  const discount = product.discount || 0;

  const oldPrice =
    product.oldPrice ||
    Math.round(product.price * 1.2);

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      {/* ================= IMAGE ================= */}

      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          onClick={() =>
            navigate(`/product/${productId}`)
          }
          className="w-full h-80 object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
        />

        {/* Discount */}

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist */}

        <button
          onClick={() => addToWishlist(product)}
          className="absolute top-3 right-3 bg-white p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-300"
        >
          <FaHeart />
        </button>

      </div>

      {/* ================= DETAILS ================= */}

      <div className="p-5">

        {/* Brand */}

        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
          {product.brand || "AU Fashion"}
        </p>

        {/* Product Name */}

        <h2
          onClick={() =>
            navigate(`/product/${productId}`)
          }
          className="font-bold text-xl cursor-pointer hover:text-blue-600 transition mt-2 min-h-16"
        >
          {product.name}
        </h2>

        {/* Rating */}

        <div className="flex items-center gap-2 mt-3">

          <FaStar className="text-yellow-400" />

          <span className="font-semibold">
            {rating}
          </span>

          <span className="text-gray-500 text-sm">
            ({reviews} Reviews)
          </span>

        </div>

        {/* Price */}

        <div className="flex items-center gap-3 mt-4">

          <span className="text-3xl font-extrabold text-blue-600">
            ₹{product.price}
          </span>

          <span className="line-through text-gray-400 text-lg">
            ₹{oldPrice}
          </span>

        </div>

        {/* Stock */}

        {product.stock > 0 ? (
          <p className="text-green-600 text-sm font-semibold mt-3">
            🚚 Free Delivery • In Stock ({product.stock} left)
          </p>
        ) : (
          <p className="text-red-500 text-sm font-semibold mt-3">
            ❌ Out of Stock
          </p>
        )}

        {/* ================= BUTTONS ================= */}

        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            onClick={() =>
              addToCart({
                ...product,
                id: product._id,
                quantity: 1,
              })
            }
            disabled={product.stock <= 0}
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:hover:scale-100 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <FaShoppingCart />
            Cart
          </button>

          <button
            onClick={() =>
              navigate(`/product/${productId}`)
            }
            className="bg-black hover:bg-gray-800 hover:scale-105 transition-all duration-300 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <FaBolt />
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;