"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { miscService } from "../services/miscService";
import { formatPrice } from "../utils/format";

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeItem, isLoading } = useCart();
  const [shippingConfig, setShippingConfig] = useState<{ flat_fee: string; free_shipping_above: string } | null>(null);

  useEffect(() => {
    miscService.getShippingConfig()
      .then(setShippingConfig)
      .catch(() => setShippingConfig({ flat_fee: "250", free_shipping_above: "5000" }));
  }, []);

  const flatFee = shippingConfig ? Number(shippingConfig.flat_fee) : 250;
  const freeAbove = shippingConfig ? Number(shippingConfig.free_shipping_above) : 5000;
  const shipping = cartTotal >= freeAbove ? 0 : flatFee;
  const total = cartTotal + shipping;

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-12">
          
          {/* Header */}
          <div className="mb-12 border-b border-foreground/10 pb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest">Your Cart</h1>
            <Link href="/collections" className="hidden md:flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-xs font-bold tracking-[0.2em] uppercase lg-btn px-6 py-3">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center lux-glass-card rounded-2xl p-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-serif text-foreground mb-4 font-bold tracking-wide">Your cart is beautifully empty.</h2>
              <p className="text-foreground/60 mb-8 max-w-md font-medium tracking-wide leading-relaxed">
                Discover our signature blends and find the perfect fragrance to elevate your presence.
              </p>
              <Link href="/collections" className="lg-btn-primary px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              
              {/* Left: Cart Items List */}
              <div className="w-full lg:w-[65%] flex flex-col gap-6">
                
                {/* Mobile Continue Shopping */}
                <Link href="/collections" className="flex md:hidden items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-xs font-bold tracking-[0.2em] uppercase mb-4 lg-btn w-fit px-6 py-3">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>

                {/* Column Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-foreground/10 text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-6">
                  {cartItems.map((item) => {
                    const price = item.variant ? Number(item.variant.discount_price || item.variant.price) : Number(item.bundle.price);
                    const name = item.variant ? item.variant.product.name : item.bundle.name;
                    const brand = item.variant ? item.variant.product.brand : "Auriq";
                    const image = item.variant ? item.variant.product.images[0]?.image_url : item.bundle.image_url;
                    
                    return (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 p-4 md:p-6 lg-card items-center group">
                      
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                        <Link href={`/products/${item.variant?.product.id}`} className="relative w-24 h-32 md:w-28 md:h-36 shrink-0 rounded-xl overflow-hidden bg-background/20 p-1 border border-foreground/10">
                          <div className="relative w-full h-full rounded-lg overflow-hidden bg-background/10">
                            <Image
                              src={image || "/placeholder.jpg"}
                              alt={name}
                              fill
                              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                            />
                          </div>
                        </Link>
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold">{brand}</span>
                          <Link href={`/products/${item.variant?.product.id}`}>
                            <h3 className="font-serif text-lg md:text-xl text-foreground hover:text-gold transition-colors font-bold tracking-wide">{name}</h3>
                          </Link>
                          {item.variant && <span className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-1">{item.variant.size_ml}ml</span>}
                          <span className="text-foreground text-sm font-semibold tracking-wide">{formatPrice(price)}</span>
                          
                          {/* Mobile Remove & Quantity */}
                          <div className="flex items-center justify-between mt-4 md:hidden">
                            <div className="flex items-center lg-input rounded-full h-10 px-2">
                             <button onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-foreground/70 hover:text-gold transition-colors">-</button>
                              <span className="w-8 text-center text-xs text-foreground font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-foreground/70 hover:text-gold transition-colors">+</button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-foreground/40 hover:text-red-400 transition-colors p-3 lg-btn !rounded-full">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Quantity */}
                      <div className="hidden md:flex col-span-3 justify-center">
                        <div className="flex items-center lg-input rounded-full h-12 px-2">
                          <button onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-foreground/70 hover:text-gold transition-colors">-</button>
                          <span className="w-10 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-foreground/70 hover:text-gold transition-colors">+</button>
                        </div>
                      </div>

                      {/* Desktop Total & Remove */}
                      <div className="hidden md:flex col-span-3 justify-end items-center gap-6">
                        <span className="text-foreground font-bold tracking-wide">
                          {formatPrice(price * item.quantity)}
                        </span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-foreground/40 hover:text-red-400 transition-colors p-3 lg-btn !rounded-full"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )})}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="w-full lg:w-[35%] sticky top-32">
                <div className="lux-glass-card p-8 flex flex-col gap-6">
                  <h3 className="font-serif text-2xl text-foreground font-bold tracking-wide border-b border-foreground/10 pb-4">Order Summary</h3>
                  
                  <div className="flex flex-col gap-4 text-sm font-medium tracking-wide">
                    <div className="flex justify-between items-center text-foreground/70">
                      <span>Subtotal</span>
                      <span className="text-foreground">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-foreground/70">
                      <span>Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? <span className="text-gold uppercase text-[10px] tracking-widest font-bold lg-badge px-2 py-0.5 bg-gold/10">Free</span> : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-foreground/10 pt-6 flex justify-between items-end">
                    <span className="text-foreground uppercase tracking-[0.2em] font-bold text-xs">Total</span>
                    <div className="flex flex-col items-end">
                      <span className="text-gradient-gold text-3xl font-serif font-bold tracking-wide">{formatPrice(total)}</span>
                      <span className="text-[10px] text-foreground/40 mt-1 tracking-widest uppercase font-bold">Includes Taxes</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="w-full lg-btn-primary text-white py-5 mt-4 text-xs font-bold tracking-[0.2em] uppercase transition-all flex justify-center items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    Secure Checkout
                  </Link>

                  <div className="flex justify-center items-center gap-4 mt-2 opacity-50">
                    <CreditCard className="w-8 h-8 text-foreground" />
                    {/* Placeholder for other payment icons */}
                    <div className="w-10 h-6 border border-foreground/30 rounded flex items-center justify-center text-[8px] font-bold text-foreground tracking-widest bg-foreground/5">VISA</div>
                    <div className="w-10 h-6 border border-foreground/30 rounded flex items-center justify-center text-[8px] font-bold text-foreground tracking-widest bg-foreground/5">MC</div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
