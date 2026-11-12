import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
  <h2 className="text-4xl mb-4">❤️</h2>

  <h2 className="text-2xl font-bold">
    Your Wishlist is Empty
  </h2>

  <p className="text-gray-500 mt-2">
    Save your favourite products here.
  </p>
</div>
        ) : (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-lg p-5 mb-4"
            >
              <div>
                <h2 className="font-bold text-lg">
                  {item.name}
                </h2>

                <p className="text-blue-600 font-semibold">
                  ₹{item.price}
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add To Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>

              </div>
            </div>
          ))
        )}

      </div>

      <Footer />
    </>
  );
}

export default Wishlist;