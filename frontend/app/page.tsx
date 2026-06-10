import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import FeaturedAds from "./components/home/FeaturedAds";
import FeaturedCollection from "./components/home/FeaturedCollection";
import BestSellers from "./components/home/BestSellers";
import OurStory from "./components/home/OurStory";
import WhyChooseAuriq from "./components/home/WhyChooseAuriq";
import ContactFeedback from "./components/home/ContactFeedback";

import PromotionalCards from "./components/home/PromotionalCards";

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1 w-full">
        <FeaturedAds />
        <Hero />
        <PromotionalCards />
        <FeaturedCollection />
        <BestSellers />
        <OurStory />
        <WhyChooseAuriq />
        <ContactFeedback />
      </main>

      <Footer />
    </>
  );
}
