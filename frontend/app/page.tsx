"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "./components/home/Hero";
import BestSellers from "./components/home/BestSellers";
import FeaturedAds from "./components/home/FeaturedAds";
import FeaturedCollection from "./components/home/FeaturedCollection";
import WhyChooseAuriq from "./components/home/WhyChooseAuriq";
import OurStory from "./components/home/OurStory";
import ContactFeedback from "./components/home/ContactFeedback";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PerfumeReveal from "./components/home/PerfumeReveal";

// Data fetching helpers
import { adService } from "./services/adService";
import { publicSettingsService } from "./services/publicSettingsService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check auth status for routing purposes (e.g., if token expired)
    const token = localStorage.getItem('auriqAccessToken');
    if (token) {
      // Validate token optionally
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main relative overflow-clip">
        {/* Ambient background noise applied globally to the main body */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          {/* Server components fetch their own data or use SWR/React Query. 
              For now we wrap them in a simple layout structure since they manage their own state 
              or receive it from parent (in true Next13+ Server Components, data would be passed down)
          */}
          <HeroWrapper />
          <PerfumeReveal />
          <FeaturedAdsWrapper />
          <FeaturedCollection />
          <BestSellers />
          <OurStory />
          <WhyChooseAuriq />
          <ContactFeedback />
        </div>
      </main>
      <Footer />
    </>
  );
}

// Wrapper components to handle data fetching for client-side rendering
// In a full Next.js 13+ App Router implementation, these would ideally be Server Components

function HeroWrapper() {
  const [ads, setAds] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      adService.getActiveAds(),
      publicSettingsService.getSettingsByGroup("HOMEPAGE")
    ]).then(([adsRes, settingsData]) => {
      if (adsRes.success) setAds(adsRes.data);
      setSettings(settingsData);
    }).catch(console.error);
  }, []);

  return <Hero ads={ads} settings={settings} />;
}

function FeaturedAdsWrapper() {
  const [ads, setAds] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      adService.getActiveAds(),
      publicSettingsService.getSettingsByGroup("HOMEPAGE")
    ]).then(([adsRes, settingsData]) => {
      if (adsRes.success) setAds(adsRes.data);
      setSettings(settingsData);
    }).catch(console.error);
  }, []);

  return <FeaturedAds ads={ads} settings={settings} />;
}
