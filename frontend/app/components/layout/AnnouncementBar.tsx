"use client";

import { useState, useEffect, useRef } from "react";
import { publicSettingsService } from "../../services/publicSettingsService";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch CMS settings
    publicSettingsService.getSettingsByGroup("HOMEPAGE").then((data) => {
      setSettings(data);
      setIsLoaded(true);
    });
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 7000);
  };

  useEffect(() => {
    // Start initial 7s timer
    startTimer();

    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If user scrolls up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        startTimer(); // Reset the 7s timer
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // If the CMS has disabled the announcement bar, don't render anything
  const isEnabled = settings.ANNOUNCEMENT_ENABLED === undefined || String(settings.ANNOUNCEMENT_ENABLED).trim() !== 'false';
  if (isLoaded && !isEnabled) {
    return null;
  }

  // Use CMS text or fallback
  const announcementText = settings.ANNOUNCEMENT_TEXT || "Free Delivery on Orders Above Rs. 5000";
  const announcementLink = settings.ANNOUNCEMENT_LINK || null;

  if (!isLoaded) {
    return (
      <div 
        className={`w-full h-[40px] transition-all duration-700 ease-in-out overflow-hidden backdrop-blur-xl
          ${isVisible ? 'max-h-[40px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}
        `}
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.9), rgba(212,175,55,0.8))' }}
      />
    );
  }

  return (
    <div 
      className={`w-full text-black text-sm font-medium flex items-center justify-center tracking-wide transition-all duration-700 ease-in-out overflow-hidden backdrop-blur-xl
        ${isVisible ? 'max-h-[40px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}
      `}
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(212,175,55,0.85))', boxShadow: '0 2px 12px rgba(212,175,55,0.2)' }}
    >
      {announcementLink ? (
        <a href={announcementLink} className="hover:underline">
          {announcementText}
        </a>
      ) : (
        <span>{announcementText}</span>
      )}
    </div>
  );
}
