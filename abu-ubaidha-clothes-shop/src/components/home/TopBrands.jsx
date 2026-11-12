function TopBrands() {
  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Levi's",
    "Zara",
    "H&M",
    "Roadster",
    "US Polo",
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          🏷️ Top Brands
        </h2>

        <p className="text-gray-500 mt-3">
          Shop your favourite fashion brands.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 py-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800">
              {brand}
            </h3>
          </div>
        ))}

      </div>

    </section>
  );
}

export default TopBrands;