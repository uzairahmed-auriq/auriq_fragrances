"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ShieldCheck, CreditCard, Truck, CheckCircle2, User, UserX } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { API_URL, apiFetch } from "../utils/api";
import { miscService } from "../services/miscService";

interface Address {
  id: number;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  label: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, refreshCart } = useCart();
  const [isGuest, setIsGuest] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; type: string; value: string; discountAmount: number; newTotal: number } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("Sindh");
  const [shippingConfig, setShippingConfig] = useState<{ flat_fee: string; free_shipping_above: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auriqAccessToken');
    if (token) {
      setIsGuest(false);
      apiFetch('/user/addresses').then((res) => {
        const addresses = res.data || [];
        setSavedAddresses(addresses);
        const def = addresses.find((a: Address) => a.is_default);
        if (def) setSelectedAddressId(def.id);
        else if (addresses.length > 0) setSelectedAddressId(addresses[0].id);
      }).catch(console.error);
    }
    miscService.getShippingConfig()
      .then(setShippingConfig)
      .catch(() => setShippingConfig({ flat_fee: "250", free_shipping_above: "5000" }));
  }, []);

  const flatFee = shippingConfig ? Number(shippingConfig.flat_fee) : 250;
  const freeAbove = shippingConfig ? Number(shippingConfig.free_shipping_above) : 5000;
  const shippingFee = cartTotal >= freeAbove ? 0 : flatFee;
  const discountAmount = appliedDiscount?.discountAmount || 0;
  const total = cartTotal + shippingFee - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim()) return;
    setIsValidatingDiscount(true);
    setDiscountError("");
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const response = await fetch(`${API_URL}/orders/validate-discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
        body: JSON.stringify({ code: discountCodeInput, cartTotal })
      });
      const data = await response.json();
      if (data.success) setAppliedDiscount(data.data);
      else { setDiscountError(data.message || "Invalid discount code"); setAppliedDiscount(null); }
    } catch { setDiscountError("Failed to apply discount"); setAppliedDiscount(null); }
    finally { setIsValidatingDiscount(false); }
  };

  const handleRemoveDiscount = () => { setAppliedDiscount(null); setDiscountCodeInput(""); setDiscountError(""); };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount).replace('PKR', 'Rs.');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      let shippingAddress;
      if (!isGuest && selectedAddressId) {
        const addr = savedAddresses.find(a => a.id === selectedAddressId);
        if (!addr) { alert("Please select a shipping address"); setIsProcessing(false); return; }
        shippingAddress = { name: addr.full_name, phone: addr.phone, street: addr.street, city: addr.city, province: addr.province, postal_code: addr.postal_code };
      } else {
        shippingAddress = { name: `${firstName} ${lastName}`.trim(), phone, street, city, province, postal_code: postalCode };
      }

      const orderData = {
        guestInfo: isGuest ? { email, name: `${firstName} ${lastName}`.trim(), phone } : undefined,
        shippingAddress,
        paymentMethod: paymentMethod === 'card' ? 'CARD' : 'COD',
        notes: '',
        discountCode: appliedDiscount?.code || undefined
      };

      const res = await createOrder(orderData);
      if (res.success) { setOrderId(res.data.id); setIsSuccess(true); await refreshCart(); }
      else alert(res.message || "Failed to create order");
    } catch (error: any) {
      alert(error.response?.data?.message || "Checkout failed");
    } finally { setIsProcessing(false); }
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
                Thank you for your purchase. Your order #AUR-{orderId} has been received and is being processed.
              </p>
              <div className="flex gap-4 w-full max-w-sm">
                <Link href={isGuest ? "/invoice" : "/orders"} className="flex-1 bg-transparent border border-foreground/20 text-foreground py-4 text-sm font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase flex justify-center items-center">View Order</Link>
                <Link href="/collections" className="flex-1 bg-gold/90 text-background py-4 text-sm font-bold tracking-widest hover:bg-foreground transition-colors uppercase flex justify-center items-center">Continue</Link>
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
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        <div className="relative z-10 container-lux pt-20 md:pt-28">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-12 font-bold">
            <Link href="/cart" className="hover:text-gold transition-colors">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Checkout</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest mb-12 border-b border-foreground/10 pb-8">Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-3/5">
              <div className="mb-8 lux-glass-card p-6 flex flex-col sm:flex-row gap-4 border border-gold/30">
                <button type="button" onClick={() => setIsGuest(true)} className={`flex-1 py-3 px-4 flex items-center justify-center gap-3 text-sm font-bold tracking-widest uppercase transition-all ${isGuest ? 'bg-gold text-background' : 'bg-transparent text-foreground/50 border border-foreground/20 hover:text-gold hover:border-gold'}`}>
                  <UserX className="w-4 h-4" /> Guest Checkout
                </button>
                <button type="button" onClick={() => setIsGuest(false)} className={`flex-1 py-3 px-4 flex items-center justify-center gap-3 text-sm font-bold tracking-widest uppercase transition-all ${!isGuest ? 'bg-gold text-background' : 'bg-transparent text-foreground/50 border border-foreground/20 hover:text-gold hover:border-gold'}`}>
                  <User className="w-4 h-4" /> Member Login
                </button>
              </div>

              <form onSubmit={handleCheckout} className="flex flex-col gap-12">
                {isGuest ? (
                  <>
                    <section>
                      <h2 className="text-xl font-serif text-foreground font-bold tracking-wide mb-6 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">1</span>
                        Contact Information
                      </h2>
                      <div className="lux-glass-card p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Email Address</label>
                          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-medium tracking-wide" />
                        </div>
                        <div className="flex flex-col gap-2 group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Phone Number</label>
                          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 (3XX) XXXXXXX" className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-medium tracking-wide" />
                        </div>
                      </div>
                    </section>
                    <section>
                      <h2 className="text-xl font-serif text-foreground font-bold tracking-wide mb-6 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">2</span>
                        Shipping Address
                      </h2>
                      <div className="lux-glass-card p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">First Name</label>
                            <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                          </div>
                          <div className="flex flex-col gap-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Last Name</label>
                            <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                          </div>
                          <div className="flex flex-col gap-2 group md:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Address</label>
                            <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street address, P.O. box, etc." className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-medium tracking-wide" />
                          </div>
                          <div className="flex flex-col gap-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">City</label>
                            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                          </div>
                          <div className="flex flex-col gap-2 group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Postal Code</label>
                            <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                          </div>
                          <div className="flex flex-col gap-2 group md:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium group-focus-within:text-gold transition-colors">Province</label>
                            <select value={province} onChange={(e) => setProvince(e.target.value)} className="bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide appearance-none">
                              <option value="Sindh" className="bg-background">Sindh</option>
                              <option value="Punjab" className="bg-background">Punjab</option>
                              <option value="KPK" className="bg-background">KPK</option>
                              <option value="Balochistan" className="bg-background">Balochistan</option>
                              <option value="Islamabad" className="bg-background">Islamabad Capital Territory</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <section>
                    <h2 className="text-xl font-serif text-foreground font-bold tracking-wide mb-6 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] text-gold font-bold">1 & 2</span>
                      Select Shipping Address
                    </h2>
                    {savedAddresses.length === 0 ? (
                      <div className="lux-glass-card p-6 text-center text-foreground/60 text-sm">
                        No saved addresses found. <Link href="/account" className="text-gold underline">Add one in your account</Link>.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {savedAddresses.map((addr) => (
                          <label key={addr.id} className={`cursor-pointer lux-glass-card p-6 flex flex-col md:flex-row md:justify-between items-start gap-4 transition-all ${selectedAddressId === addr.id ? 'border-gold bg-gold/5 shadow-lg shadow-gold/5' : 'border-foreground/10 hover:border-gold/50'}`}>
                            <div className="flex items-start gap-4">
                              <input type="radio" name="saved_address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="accent-gold w-4 h-4 mt-1" />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-bold tracking-wide text-foreground">{addr.full_name}</p>
                                  {addr.is_default && <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">Default</span>}
                                  {addr.label && <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">{addr.label}</span>}
                                </div>
                                <p className="text-sm font-medium tracking-wide text-foreground/60 leading-relaxed mt-2">
                                  {addr.street}<br />{addr.city}, {addr.postal_code}<br />{addr.province}, Pakistan
                                </p>
                                <p className="text-xs font-semibold tracking-wide text-foreground/50 mt-3">{addr.phone}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </section>
                )}

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
                    <div className="flex flex-col border border-foreground/20 rounded-lg overflow-hidden">

                      {/* COD */}
                      <label className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-foreground/5' : 'hover:bg-foreground/5'}`}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-gold w-4 h-4" />
                        <Truck className="w-5 h-5 text-foreground/70" />
                        <span className="text-sm font-semibold tracking-wide text-foreground">Cash on Delivery (COD)</span>
                      </label>
                      {paymentMethod === 'cod' && (
                        <div className="p-4 border-t border-foreground/10 bg-foreground/5">
                          <p className="text-xs text-foreground/60 font-medium tracking-wide">Pay with cash upon delivery. Our rider will collect payment at your door.</p>
                        </div>
                      )}

                      {/* Card */}
                      <label className={`flex items-center gap-4 p-4 border-t border-foreground/20 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-foreground/5' : 'hover:bg-foreground/5'}`}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-gold w-4 h-4" />
                        <CreditCard className="w-5 h-5 text-foreground/70" />
                        <div className="flex items-center justify-between flex-1">
                          <span className="text-sm font-semibold tracking-wide text-foreground">Debit / Credit Card</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">VISA</span>
                            <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded">MC</span>
                          </div>
                        </div>
                      </label>
                      {paymentMethod === 'card' && (
                        <div className="p-4 border-t border-foreground/10 bg-foreground/5 grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <input type="text" placeholder="Card Number" className="bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground font-medium tracking-wide w-full" />
                          </div>
                          <input type="text" placeholder="MM/YY" className="bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground font-medium tracking-wide w-full" />
                          <input type="text" placeholder="CVC" className="bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground font-medium tracking-wide w-full" />
                        </div>
                      )}

                    </div>
                  </div>
                </section>

                <div className="hidden lg:block">
                  <button type="submit" disabled={isProcessing || cartItems.length === 0} className="w-full bg-gold/90 text-background py-5 text-sm font-bold tracking-widest hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                    {isProcessing ? "Processing..." : "Complete Order"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="lux-glass-card p-6 md:p-8 sticky top-32">
                <h3 className="text-lg font-serif text-foreground font-bold tracking-wide mb-6 pb-4 border-b border-foreground/10">Order Summary</h3>
                <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                  {cartItems.map((item) => {
                    const price = item.variant ? Number(item.variant.discount_price || item.variant.price) : Number(item.bundle.price);
                    const name = item.variant ? item.variant.product.name : item.bundle.name;
                    const image = item.variant ? item.variant.product.images[0]?.image_url : item.bundle.image_url;
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-20 h-24 bg-foreground/5 rounded overflow-hidden flex-shrink-0">
                          <Image src={image || "/icon.svg"} alt={name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-foreground tracking-wide">{name}</span>
                            <span className="text-sm font-semibold text-foreground tracking-wide">{formatPrice(price)}</span>
                          </div>
                          {item.variant && <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold mb-2">{item.variant.size_ml}ml</span>}
                          <span className="text-xs text-foreground/60 font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    );
                  })}
                  {cartItems.length === 0 && <p className="text-sm text-foreground/60 text-center py-4">Your cart is empty.</p>}
                </div>
                <div className="flex flex-col gap-4 border-t border-foreground/10 pt-6 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium tracking-wide">Subtotal</span>
                    <span className="text-foreground font-semibold tracking-wide">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium tracking-wide">Shipping</span>
                    <span className="text-gold font-semibold tracking-wide">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-sm text-green-500">
                      <span className="font-medium tracking-wide">Discount ({appliedDiscount.code})</span>
                      <span className="font-semibold tracking-wide">-{formatPrice(appliedDiscount.discountAmount)}</span>
                    </div>
                  )}
                </div>
                <div className="mb-6 border-b border-foreground/10 pb-6">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-medium mb-2 block">Discount Code</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter code" disabled={!!appliedDiscount || isValidatingDiscount} className="flex-1 bg-transparent border border-foreground/20 rounded p-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30 text-foreground uppercase disabled:opacity-50" value={discountCodeInput} onChange={(e) => setDiscountCodeInput(e.target.value)} />
                    {appliedDiscount ? (
                      <button type="button" onClick={handleRemoveDiscount} className="bg-red-500/10 text-red-500 px-4 rounded text-sm font-bold tracking-widest hover:bg-red-500/20 transition-colors uppercase">Remove</button>
                    ) : (
                      <button type="button" onClick={handleApplyDiscount} disabled={isValidatingDiscount || !discountCodeInput} className="bg-gold/90 text-background px-4 rounded text-sm font-bold tracking-widest hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50">{isValidatingDiscount ? "..." : "Apply"}</button>
                    )}
                  </div>
                  {discountError && <p className="text-red-500 text-xs mt-2 font-medium tracking-wide">{discountError}</p>}
                </div>
                <div className="flex justify-between items-center border-t border-foreground/20 pt-6 mb-8">
                  <span className="text-lg font-serif text-foreground font-bold tracking-widest">Total</span>
                  <span className="text-xl font-semibold text-foreground tracking-wide">{formatPrice(total)}</span>
                </div>
                <div className="lg:hidden">
                  <button onClick={handleCheckout} disabled={isProcessing || cartItems.length === 0} className="w-full bg-gold/90 text-background py-5 text-sm font-bold tracking-widest hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
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