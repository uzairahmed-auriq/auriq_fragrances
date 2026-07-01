"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Search, Bell, Store, Ticket, Activity, Star, Mail, RefreshCcw, Truck, Image, Shield, Database, PieChart, Gift, Award, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { adminAuthService } from "./services/adminAuthService";

import { adminMessageService } from "./services/adminMessageService";
import { adminOrderService } from "./services/adminOrderService";
import { AdminToastProvider } from "./context/AdminToastContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    if (adminAuthService.getToken()) {
      adminMessageService.getMessages().then(msgs => {
        setHasUnread(msgs.some((m: any) => !m.is_read));
      }).catch(() => {});
      adminOrderService.getPendingCount().then(setPendingOrdersCount).catch(() => {});
    }
  }, [pathname]);

  type NavItem = { type: 'link'; name: string; href: string; icon: any } | { type: 'header'; name: string };

  const navigation: NavItem[] = [
    { type: 'link', name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    
    { type: 'header', name: 'STORE OPERATIONS' },
    { type: 'link', name: "Analytics", href: "/admin/analytics", icon: Activity },
    { type: 'link', name: "Inventory", href: "/admin/inventory", icon: Package },
    { type: 'link', name: "Products", href: "/admin/products", icon: Store },
    { type: 'link', name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { type: 'link', name: "Customers", href: "/admin/customers", icon: Users },
    { type: 'link', name: "Reviews", href: "/admin/reviews", icon: Star },
    { type: 'link', name: "Messages", href: "/admin/messages", icon: Mail },
    { type: 'link', name: "Coupons", href: "/admin/discounts", icon: Ticket },
    { type: 'link', name: "Shipping", href: "/admin/shipping", icon: Truck },

    { type: 'header', name: 'MARKETING' },
    { type: 'link', name: "Banners & Ads", href: "/admin/ads", icon: Image },
    { type: 'link', name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { type: 'link', name: "Rewards", href: "/admin/rewards", icon: Award },

    { type: 'header', name: 'CONTENT MANAGEMENT' },
    { type: 'link', name: "Homepage CMS", href: "/admin/homepage", icon: Store },
    { type: 'link', name: "Contact CMS", href: "/admin/contact", icon: Mail },
    { type: 'link', name: "Media Library", href: "/admin/media", icon: Image },

    { type: 'header', name: 'BUSINESS' },
    { type: 'link', name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },

    { type: 'header', name: 'SYSTEM' },
    { type: 'link', name: "General Settings", href: "/admin/settings", icon: Settings },
    { type: 'link', name: "Security", href: "/admin/security", icon: Shield },
    { type: 'link', name: "Backup & Export", href: "/admin/backup", icon: Database },
  ];

  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }
    const token = adminAuthService.getToken();
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // 15-minute inactivity timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 15 minutes = 15 * 60 * 1000 = 900000 ms
      timeoutId = setTimeout(() => {
        if (pathname !== '/admin/login' && adminAuthService.getToken()) {
          adminAuthService.logout();
        }
      }, 900000);
    };

    if (isAuthenticated && pathname !== '/admin/login') {
      resetTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('scroll', resetTimer);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAuthenticated, pathname]);

  if (!isAuthenticated) return <div className="h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminToastProvider>
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-foreground/10 bg-background/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-foreground/10">
          <Link href="/" className="text-xl font-serif font-bold tracking-widest text-gradient-gold">AURIQ ADMIN</Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          {navigation.map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={`header-${index}`} className="px-4 py-1 mt-3 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
                  {item.name}
                </div>
              );
            }
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${isActive
                  ? "bg-gold/10 text-gold"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-foreground/50"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-foreground/10">
          <button onClick={() => adminAuthService.logout()} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all w-full">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-foreground/[0.02]">
        {/* Top Header */}
        <header className="h-20 border-b border-foreground/10 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1"></div>
          <div className="flex items-center gap-6 relative">
            <Link
              href="/admin/orders"
              aria-label="Pending Orders"
              onClick={() => { setPendingOrdersCount(0); setHasUnread(false); }}
              className="text-foreground/60 hover:text-gold transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-gold text-background text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
                </span>
              )}
              {hasUnread && pendingOrdersCount === 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
              )}
            </Link>
            
            <button 
              aria-label="Profile Menu"
              onClick={() => {
                const el = document.getElementById('profile-dropdown');
                if (el) el.classList.toggle('hidden');
              }}
              className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-xs font-bold text-gold hover:bg-gold/30 transition-colors"
            >
              A
            </button>

            {/* Profile Dropdown */}
            <div id="profile-dropdown" className="hidden absolute right-0 top-full mt-4 w-48 bg-background border border-foreground/10 rounded-xl shadow-2xl py-2 z-50">
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground/70 hover:text-gold hover:bg-foreground/5 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <div className="border-t border-foreground/10 my-1"></div>
              <button 
                onClick={() => adminAuthService.logout()} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
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
    </AdminToastProvider>
  );
}
