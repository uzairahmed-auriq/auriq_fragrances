"use client";

import { useState, useEffect, useRef } from "react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div 
      className={`w-full bg-gold text-black text-sm font-medium flex items-center justify-center tracking-wide transition-all duration-700 ease-in-out overflow-hidden
        ${isVisible ? 'max-h-[40px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}
      `}
    >
      Free Delivery on Orders Above Rs. 5000
    </div>
  );
}
