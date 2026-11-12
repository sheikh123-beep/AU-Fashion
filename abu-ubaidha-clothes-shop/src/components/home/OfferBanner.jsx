import { useNavigate } from "react-router-dom";

function OfferBanner() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">

        <div>
          <p className="uppercase tracking-widest text-yellow-300 font-semibold">
            Limited Time Offer
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Up To 70% OFF
          </h2>

          <p className="mt-4 text-lg text-gray-100 max-w-xl">
            Grab your favorite fashion products at unbelievable prices.
            Hurry! Offer ends soon.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Shop Now
          </button>
        </div>

        <div className="text-8xl mt-10 md:mt-0">
          🛍️
        </div>

      </div>
    </section>
  );
}

export default OfferBanner;