import products from "../../data/products";
import ProductCard from "../product/ProductCard";

function BestSellers() {
  // Top 4 products by rating
 const bestProducts = [...products]
  .sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.reviews - a.reviews;
  })
  .slice(0, 4);
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h2 className="text-4xl font-bold">
            ⭐ Best Sellers
          </h2>

          <p className="text-gray-500 mt-2">
            Customers' favorite products with the highest ratings.
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition">
          View All
        </button>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {bestProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}

export default BestSellers;