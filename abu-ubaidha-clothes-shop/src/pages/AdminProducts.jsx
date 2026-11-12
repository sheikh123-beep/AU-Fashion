import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState({
    name: "",
    brand: "AU Fashion",
    price: "",
    oldPrice: "",
    discount: "",
    rating: "",
    reviews: "",
    category: "Men",
    image: "",
    description: "",
    stock: "",
  });

  // ================= GET PRODUCTS =================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load products.");
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
    fetchProducts();
  }, []);

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setForm({
      name: "",
      brand: "AU Fashion",
      price: "",
      oldPrice: "",
      discount: "",
      rating: "",
      reviews: "",
      category: "Men",
      image: "",
      description: "",
      stock: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ================= ADD PRODUCT =================

  const handleAdd = () => {
    resetForm();

    setForm({
      name: "",
      brand: "AU Fashion",
      price: "",
      oldPrice: "",
      discount: "",
      rating: "",
      reviews: "",
      category: "Men",
      image: "",
      description: "",
      stock: "",
    });

    setShowForm(true);
  };

  // ================= EDIT PRODUCT =================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      brand: product.brand || "AU Fashion",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      discount: product.discount ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
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

  // ================= SAVE PRODUCT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          oldPrice: Number(form.oldPrice) || 0,
          discount: Number(form.discount) || 0,
          rating: Number(form.rating) || 0,
          reviews: Number(form.reviews) || 0,
          stock: Number(form.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save product.");
        return;
      }

      alert(
        editingId
          ? "Product Updated Successfully! ✅"
          : "Product Added Successfully! ✅"
      );

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save Product Error:", error);
      alert("Server connection failed.");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE PRODUCT =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

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
        alert(data.message || "Failed to delete product.");
        return;
      }

      alert("Product Deleted Successfully! 🗑️");

      fetchProducts();
    } catch (error) {
      console.error("Delete Product Error:", error);
      alert("Server connection failed.");
    }
  };

  // ================= FILTER PRODUCTS =================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  // ================= CATEGORIES =================

  const categories = [
    "All",
    "Men",
    "Women",
    "Kids",
    "Shoes",
    "Watches",
    "Accessories",
  ];

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-6xl mb-5">
              🛍️
            </div>

            <h1 className="text-3xl font-bold text-gray-700">
              Loading Products...
            </h1>

            <p className="text-gray-500 mt-2">
              Please wait while products are loading.
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ================= UI =================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <p className="text-blue-600 font-semibold">
                  ADMIN PANEL
                </p>

                <h1 className="text-4xl font-extrabold mt-1">
                  Product Management
                </h1>

                <p className="text-gray-500 mt-2">
                  Add, edit, delete and manage AU Fashion products.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={fetchProducts}
                  className="bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  🔄 Refresh
                </button>

                <button
                  onClick={() => navigate("/admin")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  ← Dashboard
                </button>

                <button
                  onClick={handleAdd}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  + Add Product
                </button>

              </div>

            </div>

          </div>

          {/* ================= ADD / EDIT FORM ================= */}

          {showForm && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <p className="text-blue-600 font-semibold">
                    {editingId ? "EDIT PRODUCT" : "ADD PRODUCT"}
                  </p>

                  <h2 className="text-2xl font-bold">
                    {editingId
                      ? "Update Product"
                      : "Create New Product"}
                  </h2>
                </div>

                <button
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-semibold"
                >
                  ✕ Close
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-5"
              >

                {/* NAME */}

                <div>
                  <label className="block font-semibold mb-2">
                    Product Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Classic White T-Shirt"
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* BRAND */}

                <div>
                  <label className="block font-semibold mb-2">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="AU Fashion"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PRICE */}

                <div>
                  <label className="block font-semibold mb-2">
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="799"
                    min="0"
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* OLD PRICE */}

                <div>
                  <label className="block font-semibold mb-2">
                    Old Price
                  </label>

                  <input
                    type="number"
                    name="oldPrice"
                    value={form.oldPrice}
                    onChange={handleChange}
                    placeholder="999"
                    min="0"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* DISCOUNT */}

                <div>
                  <label className="block font-semibold mb-2">
                    Discount (%)
                  </label>

                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    max="100"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* STOCK */}

                <div>
                  <label className="block font-semibold mb-2">
                    Stock *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="50"
                    min="0"
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="block font-semibold mb-2">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories
                      .filter((item) => item !== "All")
                      .map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                  </select>
                </div>

                {/* RATING */}

                <div>
                  <label className="block font-semibold mb-2">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* REVIEWS */}

                <div>
                  <label className="block font-semibold mb-2">
                    Reviews
                  </label>

                  <input
                    type="number"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* IMAGE */}

                <div className="md:col-span-2">
                  <label className="block font-semibold mb-2">
                    Product Image URL *
                  </label>

                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {form.image && (
                    <div className="mt-4">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">
                  <label className="block font-semibold mb-2">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                    rows="5"
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* BUTTONS */}

                <div className="md:col-span-2 flex flex-wrap gap-4">

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Product"
                      : "Add Product"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Total Products
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {products.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Categories
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {
                  new Set(
                    products.map(
                      (product) => product.category
                    )
                  ).size
                }
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-500">
                Out of Stock
              </p>

              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {
                  products.filter(
                    (product) =>
                      Number(product.stock) <= 0
                  ).length
                }
              </h2>
            </div>

          </div>

          {/* ================= SEARCH + FILTER ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="🔍 Search product..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* ================= PRODUCT LIST ================= */}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-2xl font-bold">
                All Products
              </h2>

              <p className="text-gray-500 mt-1">
                Showing {filteredProducts.length} of{" "}
                {products.length} products.
              </p>

            </div>

            {filteredProducts.length === 0 ? (

              <div className="p-20 text-center">

                <div className="text-6xl mb-5">
                  📦
                </div>

                <h2 className="text-2xl font-bold text-gray-600">
                  No Products Found
                </h2>

                <p className="text-gray-400 mt-2">
                  Try another search or category.
                </p>

              </div>

            ) : (

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">

                {filteredProducts.map((product) => (

                  <div
                    key={product._id}
                    className="border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition"
                  >

                    {/* IMAGE */}

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover"
                      />

                    ) : (

                      <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-6xl">
                        📦
                      </div>

                    )}

                    {/* INFO */}

                    <div className="p-5">

                      <p className="text-sm text-blue-600 font-semibold">
                        {product.category}
                      </p>

                      <h3 className="text-xl font-bold mt-1 line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mt-5">

                        <div>
                          <p className="text-2xl font-extrabold">
                            ₹{product.price}
                          </p>

                          {Number(product.oldPrice) > 0 && (
                            <p className="text-sm text-gray-400 line-through">
                              ₹{product.oldPrice}
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-sm font-semibold ${
                            Number(product.stock) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {Number(product.stock) > 0
                            ? `Stock: ${product.stock}`
                            : "Out of Stock"}
                        </span>

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        <button
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminProducts;