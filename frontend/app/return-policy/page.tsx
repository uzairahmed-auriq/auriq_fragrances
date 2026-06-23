"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Clock } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden py-24">
        {/* Background Noise & Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="container-lux max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Customer Care</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-widest drop-shadow-md">Return Policy</h1>
          </div>

          <div className="lg-card p-8 md:p-12 lg:p-16">
            <div className="prose prose-invert max-w-none text-foreground/80 font-medium tracking-wide text-sm md:text-base leading-loose">
              
              <div className="flex items-center gap-4 mb-8 p-6 bg-gold/5 border border-gold/20 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                <div className="w-12 h-12 rounded-full lux-glass flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <p className="text-foreground font-bold tracking-wide m-0">
                  We offer a 7-day return and exchange policy to ensure your complete satisfaction.
                </p>
              </div>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Returns & Exchanges</h2>
              <p className="mb-6">
                At Auriq, we take immense pride in the craftsmanship of our fragrances. If you are not completely satisfied with your purchase, you may request a return or exchange within 7 days of receiving your order.
              </p>
              <ul className="list-none space-y-4 mb-8 pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span>Items must be unused, in their original condition, and with all original packaging and cellophane intact.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span>Opened or used fragrances cannot be returned due to hygiene and quality control standards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-lg mt-1">•</span>
                  <span>Sale items and gift cards are final sale and non-refundable.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Damaged or Incorrect Items</h2>
              <p className="mb-6">
                If your order arrives damaged or if you receive an incorrect item, please contact our Concierge team immediately at <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-gold hover:underline transition-all">uzairahmed@auriqfragnaces.com</a>. We will arrange a replacement or full refund at no additional cost to you.
              </p>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Return Process</h2>
              <ol className="list-decimal pl-5 space-y-4 mb-8 marker:text-gold marker:font-bold">
                <li className="pl-2">Contact our customer service team with your order number and reason for return.</li>
                <li className="pl-2">Wait for return authorization and shipping instructions.</li>
                <li className="pl-2">Pack the item securely in its original packaging.</li>
                <li className="pl-2">Ship the item using a trackable courier service. Note: Return shipping costs are the responsibility of the customer unless the item is defective.</li>
              </ol>

              <h2 className="text-2xl font-serif text-foreground font-bold mt-12 mb-6 border-b border-foreground/10 pb-4">Refunds</h2>
              <p>
                Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days. For Cash on Delivery (COD) orders, refunds will be issued via bank transfer.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
