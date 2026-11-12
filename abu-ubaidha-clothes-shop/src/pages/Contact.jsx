import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function Contact() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-10">
            <p className="text-blue-600 font-semibold uppercase tracking-wide">
              Get In Touch
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">
              Contact Us
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Have any questions about AU Fashion? Feel free to contact us.
              Our team will be happy to help you.
            </p>
          </div>

          {/* CONTACT CARDS */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* EMAIL */}
            <div className="bg-white rounded-2xl shadow-lg p-7 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                📧
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Email
              </h2>

              <p className="text-gray-500 mt-3 break-all">
                itsabubakar0707@gmail.com
              </p>
            </div>

            {/* PHONE */}
            <div className="bg-white rounded-2xl shadow-lg p-7 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                📞
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Phone
              </h2>

              <p className="text-gray-500 mt-3">
                9234893230
              </p>
            </div>

            {/* ADDRESS */}
            <div className="bg-white rounded-2xl shadow-lg p-7 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                📍
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Address
              </h2>

              <p className="text-gray-500 mt-3">
                Birgunj, Nepal
              </p>
            </div>

          </div>

          {/* BOTTOM MESSAGE */}
          <div className="mt-10 bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              We're Here to Help 🤝
            </h2>

            <p className="text-gray-500 mt-3">
              For orders, products, delivery or any other queries,
              please contact us using the information above.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;