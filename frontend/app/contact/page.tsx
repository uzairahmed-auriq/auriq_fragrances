"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactFeedback from "../components/home/ContactFeedback";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pt-24 pb-12">
        {/* Background Noise & Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="container-lux relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Concierge Services</span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground font-bold tracking-widest drop-shadow-md">Contact Us</h1>
            <p className="text-foreground/70 mt-6 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
              We invite you to reach out for personalized fragrance consultations, inquiries about our collections, or any assistance you may require.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <div className="lg-card p-8 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full lux-glass flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground mb-4">Email</h3>
              <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-foreground/70 hover:text-gold transition-colors font-medium tracking-wide">uzairahmed@auriqfragnaces.com</a>
            </div>

            <div className="lg-card p-8 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full lux-glass flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground mb-4">Phone</h3>
              <a href="tel:+923300383666" className="text-foreground/70 hover:text-gold transition-colors font-medium tracking-wide">+92 330 0383666</a>
            </div>

            <div className="lg-card p-8 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full lux-glass flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground mb-4">Location</h3>
              <address className="not-italic text-foreground/70 font-medium tracking-wide leading-relaxed">
                Sindh madrasa tul islamia<br />Garikhata Karachi, 74000<br />Pakistan
              </address>
            </div>
          </div>
        </div>

        {/* Reuse the ContactFeedback form from the homepage but pass a prop if needed, or just let it render */}
        <div className="border-t border-foreground/10 pt-12">
          <ContactFeedback />
        </div>
      </main>
      <Footer />
    </>
  );
}
