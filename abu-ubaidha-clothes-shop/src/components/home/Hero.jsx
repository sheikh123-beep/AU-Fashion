import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import banner1 from "../../assets/images/banner1.jpg";
import banner2 from "../../assets/images/banner2.jpg";
import banner3 from "../../assets/images/banner3.jpg";

function Hero() {
  const navigate = useNavigate();

  const banners = [banner1, banner2, banner3];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(slider);
  }, []);

  return (
    <section className="max-w-7xl mx-auto mt-6 px-4">

      <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl">

        <img
          src={banners[current]}
          alt="Banner"
          className="w-full h-full object-cover transition-all duration-700"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center">

          <div className="ml-16 text-white max-w-xl">

            <p className="uppercase tracking-[5px] text-yellow-400 font-semibold">
              NEW COLLECTION 2026
            </p>

            <h1 className="text-6xl font-extrabold mt-4 leading-tight">
              Premium Fashion
              <br />
              Starts Here
            </h1>

            <p className="mt-5 text-lg text-gray-200">
              Discover the latest clothing collection with exclusive discounts
              only at AU Fashion.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Shop Now →
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;