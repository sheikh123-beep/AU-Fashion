import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserShield,
  FaUserCircle,
  FaBoxOpen,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import products from "../../data/products";

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        search.trim()
      )}`
    );

    setSearch("");
  };

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();

    setShowDropdown(false);
    setMenuOpen(false);

    navigate("/");
  };

  // =====================================================
  // USER INITIAL
  // =====================================================

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="bg-white shadow-md sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="text-3xl font-extrabold tracking-wide">
              <span className="text-black">
                AU
              </span>

              <span className="text-blue-600">
                {" "}Fashion
              </span>
            </h1>

            <p className="text-xs uppercase tracking-[4px] text-gray-500">
              Premium Clothing Store
            </p>
          </div>

          {/* =================================================
              DESKTOP MENU
          ================================================= */}

          <ul className="hidden md:flex gap-8 font-semibold">

            <li>
              <Link
                to="/"
                className="hover:text-blue-600 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="hover:text-blue-600 transition"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-blue-600 transition"
              >
                Contact
              </Link>
            </li>

          </ul>

          {/* =================================================
              DESKTOP SEARCH
          ================================================= */}

          <div className="hidden md:block relative">

            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">

              <FaSearch
                className="text-gray-500 mr-2 cursor-pointer hover:text-blue-600 transition"
                onClick={handleSearch}
              />

              <input
                type="text"
                placeholder="Search products..."
                className="outline-none w-64"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

            </div>

            {/* =================================================
                SEARCH SUGGESTIONS
            ================================================= */}

            {search.trim() !== "" &&
              filteredProducts.length > 0 && (

                <div className="absolute bg-white shadow-xl rounded-xl mt-2 w-full z-50 overflow-hidden border">

                  {filteredProducts
                    .slice(0, 5)
                    .map((product) => (

                      <div
                        key={product.id}
                        onClick={() => {
                          navigate(
                            `/product/${product.id}`
                          );

                          setSearch("");
                        }}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      >
                        <p className="font-medium">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                      </div>

                    ))}

                </div>
              )}

          </div>

          {/* =================================================
              DESKTOP ICONS
          ================================================= */}

          <div className="hidden md:flex gap-6 text-xl items-center">

            {/* =================================================
                WISHLIST
            ================================================= */}

            <Link
              to="/wishlist"
              className="hover:text-red-500 hover:scale-110 transition"
              title="Wishlist"
            >
              <FaHeart />
            </Link>

            {/* =================================================
                CART
            ================================================= */}

            <Link
              to="/cart"
              className="relative hover:text-blue-600 hover:scale-110 transition"
              title="Cart"
            >
              <FaShoppingCart />

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              )}
            </Link>

            {/* =================================================
                USER
            ================================================= */}

            {user ? (

              <div
                className="relative"
                ref={dropdownRef}
              >

                {/* USER BUTTON */}

                <button
                  onClick={() =>
                    setShowDropdown(
                      !showDropdown
                    )
                  }
                  className="flex items-center gap-2 hover:text-blue-600 transition font-semibold max-w-[190px]"
                >

                  {/* AVATAR */}

                  <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {userInitial}
                  </span>

                  {/* NAME */}

                  <span className="truncate max-w-[110px]">
                    {user.name}
                  </span>

                  <FaChevronDown
                    className={`text-sm transition-transform ${
                      showDropdown
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {/* =================================================
                    DROPDOWN
                ================================================= */}

                {showDropdown && (

                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden">

                    {/* =================================================
                        USER HEADER
                    ================================================= */}

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold">
                          {userInitial}
                        </div>

                        <div className="min-w-0">

                          <p className="font-bold text-lg truncate">
                            {user.name}
                          </p>

                          <p className="text-sm text-blue-100 truncate">
                            {user.email}
                          </p>

                          <p className="text-xs text-blue-200 mt-1 capitalize">
                            {user.role || "User"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        PERSONAL DASHBOARD
                    ================================================= */}

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-5 py-4 hover:bg-blue-50 flex items-center gap-4 transition"
                    >

                      <FaTachometerAlt className="text-indigo-600 text-lg" />

                      <div>
                        <p className="font-semibold">
                          Personal Dashboard
                        </p>

                        <p className="text-xs text-gray-500">
                          View your account summary
                        </p>
                      </div>

                    </button>

                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-5 py-4 hover:bg-blue-50 flex items-center gap-4 transition"
                    >

                      <FaUserCircle className="text-blue-600 text-lg" />

                      <div>
                        <p className="font-semibold">
                          My Profile
                        </p>

                        <p className="text-xs text-gray-500">
                          View and edit your profile
                        </p>
                      </div>

                    </button>

                    {/* =================================================
                        ORDERS
                    ================================================= */}

                    <button
                      onClick={() => {
                        navigate("/orders");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-5 py-4 hover:bg-blue-50 flex items-center gap-4 transition"
                    >

                      <FaBoxOpen className="text-green-600 text-lg" />

                      <div>
                        <p className="font-semibold">
                          My Orders
                        </p>

                        <p className="text-xs text-gray-500">
                          Track your orders
                        </p>
                      </div>

                    </button>

                    {/* =================================================
                        WISHLIST
                    ================================================= */}

                    <button
                      onClick={() => {
                        navigate("/wishlist");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-5 py-4 hover:bg-red-50 flex items-center gap-4 transition"
                    >

                      <FaHeart className="text-red-500 text-lg" />

                      <div>
                        <p className="font-semibold">
                          My Wishlist
                        </p>

                        <p className="text-xs text-gray-500">
                          View saved products
                        </p>
                      </div>

                    </button>

                    {/* =================================================
                        ADMIN PANEL
                    ================================================= */}

                    {user.role === "admin" && (

                      <button
                        onClick={() => {
                          navigate("/admin");
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-blue-50 text-blue-600 font-semibold flex items-center gap-4 border-t transition"
                      >

                        <FaUserShield className="text-lg" />

                        <div>
                          <p>
                            Admin Panel
                          </p>

                          <p className="text-xs text-gray-500 font-normal">
                            Manage your store
                          </p>
                        </div>

                      </button>

                    )}

                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-4 text-red-600 hover:bg-red-50 flex items-center gap-4 border-t transition"
                    >

                      <FaSignOutAlt className="text-lg" />

                      <div>
                        <p className="font-semibold">
                          Logout
                        </p>

                        <p className="text-xs text-red-400">
                          Sign out of your account
                        </p>
                      </div>

                    </button>

                  </div>

                )}

              </div>

            ) : (

              /* =================================================
                 LOGIN
              ================================================= */

              <Link
                to="/login"
                className="hover:text-blue-600 hover:scale-110 transition"
                title="Login"
              >
                <FaUserCircle />
              </Link>

            )}

          </div>

          {/* =================================================
              MOBILE BUTTON
          ================================================= */}

          <button
            className="md:hidden text-2xl"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>

      </nav>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (

        <div className="md:hidden bg-white shadow-lg border-b">

          {/* HOME */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            🏠 Home
          </Link>

          {/* PRODUCTS */}

          <Link
            to="/products"
            onClick={closeMobileMenu}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            👕 Products
          </Link>

          {/* CONTACT */}

          <Link
            to="/contact"
            onClick={closeMobileMenu}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            📞 Contact
          </Link>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            onClick={closeMobileMenu}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            ❤️ Wishlist
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            🛒 Cart
          </Link>

          {/* =================================================
              MOBILE USER
          ================================================= */}

          {user ? (

            <>

              {/* USER HEADER */}

              <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl">
                    {userInitial}
                  </div>

                  <div className="min-w-0">

                    <p className="font-bold text-lg truncate">
                      {user.name}
                    </p>

                    <p className="text-sm text-blue-100 truncate">
                      {user.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* DASHBOARD */}

              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block px-6 py-4 hover:bg-blue-50 border-t"
              >
                📊 Personal Dashboard
              </Link>

              {/* PROFILE */}

              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="block px-6 py-4 hover:bg-gray-100"
              >
                👤 My Profile
              </Link>

              {/* ORDERS */}

              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className="block px-6 py-4 hover:bg-gray-100"
              >
                📦 My Orders
              </Link>

              {/* ADMIN */}

              {user.role === "admin" && (

                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="block px-6 py-4 text-blue-600 font-semibold hover:bg-blue-50 border-t"
                >
                  🛡️ Admin Panel
                </Link>

              )}

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 border-t"
              >
                🚪 Logout
              </button>

            </>

          ) : (

            /* =================================================
               MOBILE LOGIN
            ================================================= */

            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="block px-6 py-4 hover:bg-gray-100"
            >
              👤 Login
            </Link>

          )}

        </div>

      )}

    </>
  );
}

export default Navbar;