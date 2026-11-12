import Navbar from "../components/common/Navbar";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrendingProducts from "../components/home/TrendingProducts";
import BestSellers from "../components/home/BestSellers";
import OfferBanner from "../components/home/OfferBanner";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import FlashSale from "../components/home/FlashSale";
import TopBrands from "../components/home/TopBrands";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts />

      <TrendingProducts />

      <OfferBanner />

      <WhyChooseUs />

      <Footer />
    </>
  );
}

export default Home;