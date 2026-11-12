import products from "../../data/products";
import ProductCard from "../product/ProductCard";

function FeaturedProducts() {

  const featuredProducts = products.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-4xl font-bold mb-10 text-center">
        Featured Products
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedProducts;