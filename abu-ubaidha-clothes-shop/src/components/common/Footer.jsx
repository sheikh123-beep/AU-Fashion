import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        {/* Logo */}

        <div>

          <h2 className="text-3xl font-bold text-blue-400">
            AU Fashion
          </h2>

          <p className="text-gray-400 mt-4 leading-7">
            Premium fashion store offering the latest clothing,
            footwear and accessories for Men, Women & Kids.
          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li className="hover:text-white cursor-pointer">Home</li>

            <li className="hover:text-white cursor-pointer">Products</li>

            <li className="hover:text-white cursor-pointer">Categories</li>

            <li className="hover:text-white cursor-pointer">Contact</li>

          </ul>

        </div>

        {/* Customer Support */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Customer Support
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>FAQs</li>

            <li>Shipping Policy</li>

            <li>Return Policy</li>

            <li>Privacy Policy</li>

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Contact Us
          </h3>

          <div className="space-y-4 text-gray-400">

            <p className="flex items-center gap-3">
              <FaPhone />
              +977 9828333770
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope />
              abubakar@aufashion.com
            </p>

            <p className="flex items-center gap-3">
              <FaMapMarkerAlt />
              Nepal
            </p>

          </div>

        </div>

      </div>

      {/* Social */}

      <div className="border-t border-gray-700 py-6">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">

          <p className="text-gray-400">
            © 2026 AU Fashion. All Rights Reserved.
          </p>

          <div className="flex gap-5 text-xl mt-4 md:mt-0">

            <FaFacebookF className="hover:text-blue-500 cursor-pointer transition" />

            <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />

            <FaTwitter className="hover:text-sky-400 cursor-pointer transition" />

            <FaLinkedin className="hover:text-blue-400 cursor-pointer transition" />

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;