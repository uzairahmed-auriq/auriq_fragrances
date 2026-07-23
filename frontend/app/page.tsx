import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import FeaturedAds from "./components/home/FeaturedAds";
import FeaturedCollection from "./components/home/FeaturedCollection";
import FeaturedGrid from "./components/home/FeaturedGrid";
import OurStory from "./components/home/OurStory";
import ContactFeedback from "./components/home/ContactFeedback";
import { productService } from "./services/productService";
import { adService } from "./services/adService";

export default async function Home() {
  const [featuredData, adsData, allProductsData] = await Promise.all([
    productService.getFeaturedProducts().catch(() => ({ data: [] })),
    adService.getActiveAds().catch(() => ({ data: [] })),
    productService.getAllProducts().catch(() => ({ data: [] }))
  ]);

  const featuredProducts = featuredData.data || [];
  const ads = adsData.data || [];
  const allProducts = allProductsData.data || [];

  return (
    <>
      <Header />

      <main className="flex-1 w-full">
        <FeaturedAds ads={ads} />
        <Hero />
        <FeaturedCollection products={featuredProducts} />
        <FeaturedGrid products={allProducts} />
        <OurStory />
        <ContactFeedback />
      </main>

      <Footer />
    </>
  );
}
