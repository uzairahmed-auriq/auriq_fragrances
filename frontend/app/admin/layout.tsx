"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Search, Bell, Store } from "lucide-react";
import ThemeToggle from "../components/layout/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Storefront Editor", href: "/admin/storefront", icon: Store },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-foreground/10 bg-background/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-foreground/10">
          <Link href="/" className="text-xl font-serif font-bold tracking-widest text-gradient-gold">AURIQ ADMIN</Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  isActive 
                    ? "bg-gold/10 text-gold" 
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-gold" : "text-foreground/50"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-foreground/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all w-full">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-foreground/[0.02]">
        {/* Top Header */}
        <header className="h-20 border-b border-foreground/10 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-transparent border border-foreground/20 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-foreground/60 hover:text-gold transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
            </button>
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-xs font-bold text-gold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
