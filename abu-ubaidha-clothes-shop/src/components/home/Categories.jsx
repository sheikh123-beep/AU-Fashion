import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    "Men",
    "Women",
    "Kids",
    "Accessories",
    "Sale",
  ];

  const handleCategoryClick = (category) => {
    if (category === "Sale") {
      navigate("/products");
    } else {
      navigate(`/products?category=${category}`);
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-6">

      <h2 className="text-3xl font-bold text-center mb-8">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

        {categories.map((category) => (

          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-blue-100 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-600 hover:text-white transition duration-300 hover:scale-105"
          >

            <h3 className="text-xl font-semibold">
              {category}
            </h3>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Categories;