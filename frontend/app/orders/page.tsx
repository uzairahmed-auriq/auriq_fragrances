"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Package, ChevronRight, Download, Eye, Sparkles } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getMyOrders } from "../services/orderService";

function OrdersContent() {
  const searchParams = useSearchParams();
  const addedLoyalty = searchParams.get('loyalty') === 'true';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-20 md:pt-28 max-w-5xl">
          
          {addedLoyalty && (
            <div className="mb-8 bg-gold/10 border border-gold/30 p-4 flex items-center justify-center gap-3 rounded-lg animate-in fade-in zoom-in duration-500">
              <Sparkles className="w-5 h-5 text-gold" />
              <p className="text-sm font-bold tracking-widest text-gold uppercase">Order Successful! +150 Loyalty Points Added to your account.</p>
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
          )}

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-12 font-bold">
            <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Orders</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-foreground/10 pb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest mb-4">Order History</h1>
              <p className="text-foreground/60 text-sm font-medium tracking-wide">View and track your recent purchases.</p>
            </div>
            <Link href="/collections" className="inline-flex items-center justify-center bg-transparent border border-foreground/20 text-foreground py-3 px-8 text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase whitespace-nowrap">
              Continue Shopping
            </Link>
          </div>

          <div className="flex flex-col gap-8">
            {loading ? (
              <div className="text-gold py-12 text-center">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-foreground/60 py-12 text-center lux-glass-card">
                You haven't placed any orders yet.
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="lux-glass-card overflow-hidden">
                {/* Order Header */}
                <div className="bg-foreground/5 p-6 border-b border-foreground/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-auto">
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Order Placed</span>
                      <span className="text-sm text-foreground font-semibold tracking-wide">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Total</span>
                      <span className="text-sm text-foreground font-semibold tracking-wide">Rs. {Number(order.total).toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Order Number</span>
                      <span className="text-sm text-foreground font-semibold tracking-wide">AUR-{order.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-gold transition-colors opacity-50 cursor-not-allowed">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <span className="text-foreground/20">|</span>
                    <Link href={`/invoice/${order.id}`} className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-gold transition-colors">
                      <Download className="w-4 h-4" /> Invoice
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-5 h-5 text-gold" />
                    <h3 className="text-lg font-serif text-foreground font-bold tracking-wide">
                      Status: <span className="text-gold capitalize">{order.status}</span>
                    </h3>
                  </div>

                  <div className="flex flex-col gap-6">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-6">
                        <div className="relative w-24 h-24 bg-background rounded overflow-hidden flex-shrink-0 border border-foreground/10">
                          <Image 
                            src={item.product?.images?.[0]?.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop"} 
                            alt={item.product?.name || "Product Image"} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <Link href={`/products/${item.product?.id}`}>
                            <span className="text-base font-bold text-foreground hover:text-gold transition-colors tracking-wide block mb-1">{item.product?.name}</span>
                          </Link>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold mb-2">Rs. {Number(item.price_at_time).toLocaleString()}</span>
                          <span className="text-sm text-foreground/80 font-medium">Qty: {item.quantity}</span>
                        </div>
                        <div className="hidden md:block">
                          <button className="bg-transparent border border-foreground/20 text-foreground py-2 px-6 text-[10px] font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase whitespace-nowrap opacity-50 cursor-not-allowed">
                            Buy Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile Buy Again */}
                  <div className="mt-6 md:hidden">
                    <button className="w-full bg-transparent border border-foreground/20 text-foreground py-3 text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase opacity-50 cursor-not-allowed">
                      Buy Again
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-perfume-main flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>}>
      <OrdersContent />
    </Suspense>
  );
}