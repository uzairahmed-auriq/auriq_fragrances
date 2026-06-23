"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden py-24">
        {/* Background Noise & Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="container-lux max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Delivery & Logistics</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-widest drop-shadow-md">Shipping Policy</h1>
          </div>

          <div className="lg-card p-8 md:p-12 lg:p-16">
            <div className="prose prose-invert max-w-none text-foreground/80 font-medium tracking-wide text-sm md:text-base leading-loose">
              
              <div className="flex items-center gap-4 mb-8 p-6 bg-gold/5 border border-gold/20 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                <div className="w-12 h-12 rounded-full lux-glass flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 text-gold" />
                </div>
                <p className="text-foreground font-bold tracking-wide m-0">
                  Complimentary nationwide shipping on all orders exceeding Rs. 5000.
                </p>
              </div>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Processing Time</h2>
              <p className="mb-6">
                All orders are processed with the utmost care and attention. Standard order processing takes 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
              </p>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Shipping Rates & Estimates</h2>
              <p className="mb-6">
                Shipping charges for your order will be calculated and displayed at checkout.
              </p>
              <ul className="list-none space-y-4 mb-8 pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span><strong>Standard Delivery (Nationwide):</strong> Rs. 250 (Estimated delivery: 3-5 business days).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span><strong>Free Shipping:</strong> Available on all orders over Rs. 5000.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Order Tracking</h2>
              <p className="mb-6">
                Once your order has dispatched, you will receive an email containing your tracking number and a link to monitor your shipment's progress. Please allow up to 24 hours for the tracking portal to update.
              </p>
              
              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Delivery Issues</h2>
              <p className="mb-6">
                If your order arrives damaged in any way, please email us as soon as possible at <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-gold hover:underline transition-all">uzairahmed@auriqfragnaces.com</a> with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
