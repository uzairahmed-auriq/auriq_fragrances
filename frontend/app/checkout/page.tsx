"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden flex items-center justify-center pt-20">
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
          <div className="relative z-10 max-w-2xl w-full mx-4">
            <div className="lux-glass-card p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-6 border border-gold/50">
                <CheckCircle2 className="w-10 h-10 text-gold" />
              </div>
              <h1 className="text-4xl font-serif text-gradient-gold font-bold tracking-widest mb-4">Order Confirmed</h1>
              <p className="text-foreground/80 font-medium tracking-wide mb-8">
                Thank you for your purchase. Your order #AUR-{Math.floor(Math.random() * 100000)} has been received and is currently being processed.
              </p>
              <div className="flex gap-4 w-full max-w-sm">
                <Link href="/orders" className="flex-1 bg-transparent border border-foreground/20 text-foreground py-4 text-sm font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase">
                  View Order
                </Link>
                <Link href="/collections" className="flex-1 bg-gold/90 text-background py-4 text-sm font-bold tracking-widest hover:bg-foreground transition-colors uppercase">
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-20 md:pt-28">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-12 font-bold">
            <Link href="/cart" className="hover:text-gold transition-colors">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Checkout</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest mb-12 border-b border-foreground/10 pb-8">Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Form */}
            <div className="w-full lg:w-3/5">
              <form onSubmit={handleCheckout} className="flex flex-col gap-12">
                
                {/* Contact Information */}
                <section>
                  <h2 className="text-xl font-serif text-foreground font-bold tracking-wide mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">1</span>
                    Contact Information
                  </h2>
                  <div className="lux-glass-card p-6 md:p-8">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Email Address</label>
                        <input type="email" required placeholder="you@example.com" className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-medium tracking-wide" />
                      </div>
                      <div className="flex flex-col gap-2 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Phone Number</label>
                        <input type="tel" required placeholder="+1 (555) 000-0000" className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-medium tracking-wide" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Shipping Address */}
                <section>
                  <h2 className="text-xl font-serif text-foreground font-bold tracking-wide mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">2</span>
                    Shipping Address
                  </h2>
                  <div className="lux-glass-card p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">First Name</label>
                        <input type="text" required className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                      </div>
                      <div className="flex flex-col gap-2 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Last Name</label>
                        <input type="text" required className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                      </div>
                      <div className="flex flex-col gap-2 group md:col-span-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Address</label>
                        <input type="text" required placeholder="Street address, P.O. box, etc." className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-medium tracking-wide" />
                      </div>
                      <div className="flex flex-col gap-2 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">City</label>
                        <input type="text" required className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                      </div>
                      <div className="flex flex-col gap-2 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Postal Code</label>
                        <input type="text" required className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                      </div>
                      <div className="flex flex-col gap-2 group md:col-span-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Country</label>
                        <select className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide appearance-none">
                          <option value="US" className="bg-background">United States</option>
                          <option value="UK" className="bg-background">United Kingdom</option>
                          <option value="PK" className="bg-background">Pakistan</option>
                          <option value="AE" className="bg-background">United Arab Emirates</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section>
                  <h2 className="text-xl font-serif text-foreground font-bold tracking-wide mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">3</span>
                    Payment
                  </h2>
                  <div className="lux-glass-card p-6 md:p-8 flex flex-col gap-4">
                    <p className="text-xs text-foreground/60 mb-2 font-medium tracking-wide flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold" /> All transactions are secure and encrypted.
                    </p>
                    
                    {/* Payment Options */}
                    <div className="flex flex-col border border-foreground/20 rounded-lg overflow-hidden">
                      <label className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-foreground/5' : 'hover:bg-foreground/5'}`}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-gold w-4 h-4" />
                        <CreditCard className="w-5 h-5 text-foreground/70" />
                        <span className="text-sm font-semibold tracking-wide text-foreground">Credit Card</span>
                      </label>
                      
                      {paymentMethod === 'card' && (
                        <div className="p-4 border-t border-foreground/10 bg-foreground/5 grid grid-cols-2 gap-4">
                           <div className="flex flex-col gap-2 group col-span-2">
                            <input type="text" placeholder="Card Number" className="bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground font-medium tracking-wide w-full" />
                          </div>
                          <div className="flex flex-col gap-2 group">
                            <input type="text" placeholder="MM/YY" className="bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground font-medium tracking-wide w-full" />
                          </div>
                          <div className="flex flex-col gap-2 group">
                            <input type="text" placeholder="CVC" className="bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground font-medium tracking-wide w-full" />
                          </div>
                        </div>
                      )}

                      <label className={`flex items-center gap-4 p-4 border-t border-foreground/20 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-foreground/5' : 'hover:bg-foreground/5'}`}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-gold w-4 h-4" />
                        <Truck className="w-5 h-5 text-foreground/70" />
                        <span className="text-sm font-semibold tracking-wide text-foreground">Cash on Delivery (COD)</span>
                      </label>
                      
                      {paymentMethod === 'cod' && (
                        <div className="p-4 border-t border-foreground/10 bg-foreground/5">
                          <p className="text-xs text-foreground/60 font-medium tracking-wide">Pay with cash upon delivery.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <div className="hidden lg:block">
                  <button type="submit" disabled={isProcessing} className="w-full bg-gold/90 text-background py-5 text-sm font-bold tracking-widest hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                    {isProcessing ? "Processing..." : "Complete Order"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="lux-glass-card p-6 md:p-8 sticky top-32">
                <h3 className="text-lg font-serif text-foreground font-bold tracking-wide mb-6 pb-4 border-b border-foreground/10">Order Summary</h3>
                
                <div className="flex flex-col gap-6 mb-8">
                  {/* Sample Cart Item */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 bg-foreground/5 rounded overflow-hidden flex-shrink-0">
                      <Image src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" alt="Royal Oud" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-foreground tracking-wide">Royal Oud</span>
                        <span className="text-sm font-semibold text-foreground tracking-wide">Rs. 15,000</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold mb-2">50ml</span>
                      <span className="text-xs text-foreground/60 font-medium">Qty: 1</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-foreground/10 pt-6 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium tracking-wide">Subtotal</span>
                    <span className="text-foreground font-semibold tracking-wide">Rs. 15,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium tracking-wide">Shipping</span>
                    <span className="text-gold font-semibold tracking-wide">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium tracking-wide">Tax</span>
                    <span className="text-foreground font-semibold tracking-wide">Rs. 0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-foreground/20 pt-6 mb-8">
                  <span className="text-lg font-serif text-foreground font-bold tracking-widest">Total</span>
                  <span className="text-xl font-semibold text-foreground tracking-wide">Rs. 15,000</span>
                </div>

                {/* Mobile submit button */}
                <div className="lg:hidden">
                  <button onClick={handleCheckout} disabled={isProcessing} className="w-full bg-gold/90 text-background py-5 text-sm font-bold tracking-widest hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                    {isProcessing ? "Processing..." : "Complete Order"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
