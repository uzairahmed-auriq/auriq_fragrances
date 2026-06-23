"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden py-24">
        {/* Background Noise & Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="container-lux max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Heritage & Craft</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-widest drop-shadow-md">Our Story</h1>
          </div>

          <div className="lg-card p-8 md:p-12 lg:p-16">
            <div className="prose prose-invert max-w-none text-foreground/80 font-medium tracking-wide text-sm md:text-base leading-loose">
              
              <div className="flex items-center gap-4 mb-8 p-6 bg-gold/5 border border-gold/20 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                <div className="w-12 h-12 rounded-full lux-glass flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-gold" />
                </div>
                <p className="text-foreground font-bold tracking-wide m-0">
                  Auriq Fragrances is a symphony of heritage, art, and the most exquisite ingredients nature has to offer.
                </p>
              </div>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">The Genesis</h2>
              <p className="mb-6">
                Born from a deep-rooted passion for the olfactory arts, Auriq Fragrances was founded on the belief that a scent is the most profound trigger of memory and emotion. We embarked on a journey to revive the ancient traditions of perfumery, blending them seamlessly with contemporary elegance to create fragrances that are both timeless and avant-garde.
              </p>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Our Philosophy</h2>
              <p className="mb-6">
                We believe in the art of slow perfumery. Every Auriq fragrance is meticulously crafted over months, sometimes years. We do not mass-produce; we curate. Our master perfumers are artisans who view each composition as a masterpiece, ensuring that every drop resonates with depth, complexity, and character.
              </p>
              
              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">The Ingredients</h2>
              <p className="mb-6">
                Our commitment to excellence begins with our ingredients. We traverse the globe to source the rarest and most precious botanical extracts, resins, and absolutes. From the ancient oud forests of Southeast Asia to the sun-drenched citrus groves of the Mediterranean, we select only the finest raw materials, ensuring sustainability and ethical sourcing at every step.
              </p>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">The Experience</h2>
              <p className="mb-6">
                An Auriq fragrance is designed to be an intimate experience. It is an invisible garment that drapes elegantly over the skin, evolving beautifully throughout the day. It is our hope that our creations become a part of your personal narrative, evoking confidence, allure, and unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
