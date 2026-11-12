import {
  FaTruck,
  FaUndo,
  FaLock,
  FaHeadset,
} from "react-icons/fa";

function WhyChooseUs() {
  const features = [
    {
      icon: <FaTruck size={35} />,
      title: "Free Delivery",
      desc: "Free shipping across India.",
    },
    {
      icon: <FaUndo size={35} />,
      title: "Easy Returns",
      desc: "7 Days hassle-free returns.",
    },
    {
      icon: <FaLock size={35} />,
      title: "Secure Payment",
      desc: "100% safe online payment.",
    },
    {
      icon: <FaHeadset size={35} />,
      title: "24/7 Support",
      desc: "Always ready to help you.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-4xl font-bold text-center mb-12">
        Why Choose AU Fashion?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition"
          >
            <div className="text-blue-600 flex justify-center mb-5">
              {item.icon}
            </div>

            <h3 className="font-bold text-xl mb-3">
              {item.title}
            </h3>

            <p className="text-gray-500">
              {item.desc}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default WhyChooseUs;