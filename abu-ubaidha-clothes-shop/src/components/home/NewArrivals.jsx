import products from "../../data/products";
import ProductCard from "../product/ProductCard";

function NewArrivals() {
  // Alag products dikhayenge (5th se 8th)
  const newArrivals = products.slice(16, 20);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h2 className="text-4xl font-bold">
            🆕 New Arrivals
          </h2>

          <p className="text-gray-500 mt-2">
            Fresh styles just arrived for you.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition">
          Explore More
        </button>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {newArrivals.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default NewArrivals;