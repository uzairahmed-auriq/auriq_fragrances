import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, Download, Eye } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Dummy data for orders
const pastOrders = [
  {
    id: "AUR-84729",
    date: "June 05, 2026",
    status: "Delivered",
    total: "Rs. 15,000",
    items: [
      {
        name: "Royal Oud",
        size: "50ml",
        qty: 1,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "AUR-39102",
    date: "April 12, 2026",
    status: "Shipped",
    total: "Rs. 32,500",
    items: [
      {
        name: "Baccarat Rouge",
        size: "100ml",
        qty: 1,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop"
      },
      {
        name: "Aventus",
        size: "50ml",
        qty: 1,
        image: "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop"
      }
    ]
  }
];

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-20 md:pt-28 max-w-5xl">
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
            {pastOrders.map((order) => (
              <div key={order.id} className="lux-glass-card overflow-hidden">
                {/* Order Header */}
                <div className="bg-foreground/5 p-6 border-b border-foreground/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-auto">
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Order Placed</span>
                      <span className="text-sm text-foreground font-semibold tracking-wide">{order.date}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Total</span>
                      <span className="text-sm text-foreground font-semibold tracking-wide">{order.total}</span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Order Number</span>
                      <span className="text-sm text-foreground font-semibold tracking-wide">{order.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-gold transition-colors">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <span className="text-foreground/20">|</span>
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-gold transition-colors">
                      <Download className="w-4 h-4" /> Invoice
                    </button>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-5 h-5 text-gold" />
                    <h3 className="text-lg font-serif text-foreground font-bold tracking-wide">
                      Status: <span className="text-gold">{order.status}</span>
                    </h3>
                  </div>

                  <div className="flex flex-col gap-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-6">
                        <div className="relative w-24 h-24 bg-background rounded overflow-hidden flex-shrink-0 border border-foreground/10">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <Link href={`/products/${item.name.toLowerCase().replace(/ /g, '-')}`}>
                            <span className="text-base font-bold text-foreground hover:text-gold transition-colors tracking-wide block mb-1">{item.name}</span>
                          </Link>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold mb-2">{item.size}</span>
                          <span className="text-sm text-foreground/80 font-medium">Qty: {item.qty}</span>
                        </div>
                        <div className="hidden md:block">
                          <button className="bg-transparent border border-foreground/20 text-foreground py-2 px-6 text-[10px] font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase whitespace-nowrap">
                            Buy Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile Buy Again */}
                  <div className="mt-6 md:hidden">
                    <button className="w-full bg-transparent border border-foreground/20 text-foreground py-3 text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase">
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
