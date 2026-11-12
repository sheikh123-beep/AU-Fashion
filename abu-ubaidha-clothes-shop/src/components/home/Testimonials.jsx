import { FaStar } from "react-icons/fa";

function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      city: "Delhi",
      review:
        "Amazing quality clothing! Fast delivery and premium fabric.",
      rating: 5,
    },
    {
      id: 2,
      name: "Aisha Khan",
      city: "Mumbai",
      review:
        "Loved my dress. The fitting and quality exceeded my expectations.",
      rating: 5,
    },
    {
      id: 3,
      name: "Arjun Patel",
      city: "Ahmedabad",
      review:
        "Excellent customer support and genuine products. Highly recommended.",
      rating: 5,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          ⭐ Customer Reviews
        </h2>

        <p className="text-gray-500 mt-3">
          Trusted by thousands of happy customers across India.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {reviews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
          >
            <div className="flex text-yellow-400 mb-4">
              {[...Array(item.rating)].map((_, index) => (
                <FaStar key={index} />
              ))}
            </div>

            <p className="italic text-gray-600">
              "{item.review}"
            </p>

            <h3 className="mt-6 font-bold text-lg">
              {item.name}
            </h3>

            <p className="text-gray-500">
              {item.city}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Testimonials;