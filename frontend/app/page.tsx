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
  // Fetch dynamic data in parallel
  const [featuredData, adsData, settingsData, allProductsData] = await Promise.all([
    productService.getFeaturedProducts().catch(() => ({ data: [] })),
    adService.getActiveAds().catch(() => ({ data: [] })),
    import('./services/publicSettingsService').then(m => m.publicSettingsService.getSettingsByGroup("HOMEPAGE")).catch(() => ({})),
    productService.getAllProducts().catch(() => ({ data: [] }))
  ]);

  let featuredProducts = featuredData.data || [];
  const ads = adsData.data || [];
  const settings = settingsData || {};
  const allProducts = allProductsData.data || [];

  return (
    <>
      <Header />
      
      <main className="flex-1 w-full">
        <FeaturedAds ads={ads} settings={settings} />
        <Hero settings={settings} />
        <FeaturedCollection products={featuredProducts} />
        <FeaturedGrid products={allProducts} />
        <OurStory />
        <ContactFeedback />
      </main>

      <Footer />
    </>
  );
}
