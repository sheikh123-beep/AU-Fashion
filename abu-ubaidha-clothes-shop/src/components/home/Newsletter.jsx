import { FaPaperPlane } from "react-icons/fa";

function Newsletter() {
  return (
    <section className="bg-blue-600 py-16 mt-16">

      <div className="max-w-5xl mx-auto text-center text-white px-6">

        <h2 className="text-4xl font-bold">
          Stay Updated!
        </h2>

        <p className="mt-4 text-lg text-blue-100">
          Subscribe to get exclusive offers, latest arrivals and special discounts.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-96 px-5 py-4 rounded-lg text-black outline-none"
          />

          <button
            className="bg-black hover:bg-gray-900 px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FaPaperPlane />
            Subscribe
          </button>

        </div>

      </div>

    </section>
  );
}

export default Newsletter;