import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBox,
  FaPlus,
  FaTrash,
  FaSync,
  FaSignOutAlt,
  FaEdit,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Men",
    image: "",
    description: "",
    stock: "",
  });

  // =========================
  // CHECK ADMIN
  // =========================

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      alert("Access Denied. Admin Only!");
      navigate("/");
    }
  }, [user, navigate]);

  // =========================
  // GET PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load products");
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch Products Error:", error);
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
    }
  }, [user]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "Men",
      image: "",
      description: "",
      stock: "",
    });

    setEditingProduct(null);
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.image ||
      !formData.description ||
      formData.stock === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            image: formData.image,
            description: formData.description,
            stock: Number(formData.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add product");
        return;
      }

      alert("Product Added Successfully! 🎉");

      resetForm();
      setShowForm(false);

      fetchProducts();
    } catch (error) {
      console.error("Add Product Error:", error);
      alert("Server connection failed.");
    }
  };

  // =========================
  // START EDIT
  // =========================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "Men",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock ?? "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.image ||
      !formData.description ||
      formData.stock === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            image: formData.image,
            description: formData.description,
            stock: Number(formData.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update product");
        return;
      }

      alert("Product Updated Successfully! ✏️");

      resetForm();
      setShowForm(false);

      fetchProducts();
    } catch (error) {
      console.error("Update Product Error:", error);
      alert("Server connection failed.");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    resetForm();
    setShowForm(false);
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete product");
        return;
      }

      alert("Product Deleted Successfully! 🗑️");

      fetchProducts();
    } catch (error) {
      console.error("Delete Product Error:", error);
      alert("Server connection failed.");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // STATISTICS
  // =========================

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const outOfStock = products.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length;

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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <p className="text-blue-600 font-semibold">
                  ADMIN PANEL
                </p>

                <h1 className="text-4xl font-extrabold mt-1">
                  Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                  Welcome back, {user?.name} 👋
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                {/* Orders */}

                <button
                  onClick={() =>
                    navigate("/admin/orders")
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
                >
                  <FaShoppingBag />
                  Manage Orders
                </button>

                {/* Refresh */}

                <button
                  onClick={fetchProducts}
                  className="bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
                >
                  <FaSync />
                  Refresh
                </button>

                {/* Logout */}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
                >
                  <FaSignOutAlt />
                  Logout
                </button>

              </div>

            </div>
          </div>

          {/* ================= STATISTICS ================= */}

          <div className="grid md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500">
                    Total Products
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {products.length}
                  </h2>
                </div>

                <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-2xl">
                  <FaBox />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <p className="text-gray-500">
                Total Stock
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {totalStock}
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <p className="text-gray-500">
                Out of Stock
              </p>

              <h2 className="text-4xl font-bold text-red-500 mt-2">
                {outOfStock}
              </h2>

            </div>

          </div>

          {/* ================= ADD PRODUCT BUTTON ================= */}

          <div className="flex justify-end mb-6">

            <button
              onClick={() => {
                if (showForm) {
                  handleCancelEdit();
                } else {
                  resetForm();
                  setShowForm(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg"
            >
              {showForm ? <FaTimes /> : <FaPlus />}

              {showForm
                ? "Close Form"
                : "Add New Product"}
            </button>

          </div>

          {/* ================= PRODUCT FORM ================= */}

          {showForm && (

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                {editingProduct && (
                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                    Editing Product
                  </span>
                )}

              </div>

              <form
                onSubmit={
                  editingProduct
                    ? handleUpdateProduct
                    : handleAddProduct
                }
                className="grid md:grid-cols-2 gap-5"
              >

                {/* Name */}

                <div>
                  <label className="font-semibold">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Classic White T-Shirt"
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price */}

                <div>
                  <label className="font-semibold">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="799"
                    min="0"
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 mt-2"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Watches">Watches</option>
                    <option value="Accessories">
                      Accessories
                    </option>
                  </select>
                </div>

                {/* Stock */}

                <div>
                  <label className="font-semibold">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Image */}

                <div className="md:col-span-2">

                  <label className="font-semibold">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label className="font-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Premium Cotton T-Shirt"
                    rows="4"
                    className="w-full border rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Buttons */}

                <div className="md:col-span-2 grid md:grid-cols-2 gap-4">

                  <button
                    type="submit"
                    className={
                      editingProduct
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold text-lg"
                        : "bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg"
                    }
                  >
                    {editingProduct ? (
                      <>
                        <FaEdit className="inline mr-2" />
                        Update Product
                      </>
                    ) : (
                      <>
                        <FaPlus className="inline mr-2" />
                        Add Product
                      </>
                    )}
                  </button>

                  {editingProduct && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg"
                    >
                      <FaTimes className="inline mr-2" />
                      Cancel Edit
                    </button>
                  )}

                </div>

              </form>

            </div>
          )}

          {/* ================= PRODUCTS TABLE ================= */}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-2xl font-bold">
                Product Management
              </h2>

              <p className="text-gray-500 mt-1">
                Manage all products from here.
              </p>

            </div>

            {loading ? (

              <div className="p-20 text-center">

                <p className="text-xl text-gray-500">
                  Loading products...
                </p>

              </div>

            ) : products.length === 0 ? (

              <div className="p-20 text-center">

                <p className="text-xl text-gray-500">
                  No products found.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="text-left px-6 py-4">
                        Product
                      </th>

                      <th className="text-left px-6 py-4">
                        Category
                      </th>

                      <th className="text-left px-6 py-4">
                        Price
                      </th>

                      <th className="text-left px-6 py-4">
                        Stock
                      </th>

                      <th className="text-center px-6 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {products.map((product) => (

                      <tr
                        key={product._id}
                        className="border-t hover:bg-gray-50"
                      >

                        {/* Product */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-4">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />

                            <div>

                              <p className="font-bold">
                                {product.name}
                              </p>

                              <p className="text-gray-500 text-sm">
                                ID: {product._id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Category */}

                        <td className="px-6 py-4">

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {product.category}
                          </span>

                        </td>

                        {/* Price */}

                        <td className="px-6 py-4 font-bold">
                          ₹{product.price}
                        </td>

                        {/* Stock */}

                        <td className="px-6 py-4">

                          <span
                            className={
                              Number(product.stock) > 0
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {product.stock}
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4">

                          <div className="flex justify-center gap-3">

                            <button
                              onClick={() =>
                                handleEdit(product)
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-xl"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(product._id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>

                          </div>

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

export default AdminDashboard;