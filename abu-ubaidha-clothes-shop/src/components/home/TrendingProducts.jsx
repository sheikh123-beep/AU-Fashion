import { useNavigate } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../product/ProductCard";

function TrendingProducts() {
    const navigate = useNavigate();
 const trending = products.slice(4, 8);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h2 className="text-4xl font-bold">
            🔥 Trending Products
          </h2>

          <p className="text-gray-500 mt-2">
            Most loved fashion products this week.
          </p>
        </div>

        <button
  onClick={() => navigate("/products")}
  className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
>
  View All
</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {trending.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default TrendingProducts;