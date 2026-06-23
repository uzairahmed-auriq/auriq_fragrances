"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { apiFetch } from "../utils/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auriqAccessToken');
        if (!token) {
          window.location.href = '/admin/login';
          return;
        }

        // Verify admin role via profile endpoint
        const res = await apiFetch('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.success && res.data.role === 'ADMIN') {
          setIsAuthenticated(true);
          setAdminUser({ name: res.data.name, email: res.data.email });
        } else {
          window.location.href = '/admin/login';
        }
      } catch (err) {
        window.location.href = '/admin/login';
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('auriqRefreshToken');
      if (refreshToken) {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('auriqAccessToken');
      localStorage.removeItem('auriqRefreshToken');
      localStorage.removeItem('auriqUser');
      window.dispatchEvent(new Event('loginStateChange'));
      window.location.href = '/admin/login';
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-perfume-main flex items-center justify-center relative">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin relative z-10 shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Inventory", href: "/admin/inventory", icon: <Package className="w-5 h-5" /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Customers", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
    { name: "Reviews", href: "/admin/reviews", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Banners", href: "/admin/banners", icon: <ImageIcon className="w-5 h-5" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-perfume-main flex relative overflow-hidden">
      {/* Background Noise & Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 lg-modal-backdrop z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 lg-sidebar flex flex-col z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full lux-glass flex items-center justify-center p-1 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
              <Image src="/icon.svg" alt="Auriq Logo" width={32} height={32} className="rounded-full" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold tracking-widest text-foreground group-hover:text-gold transition-colors">AURIQ</h2>
              <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gold">Admin Portal</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-foreground/50 hover:text-foreground transition-colors p-2 lg-btn !rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-gold/15 text-gold border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                      : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground border border-transparent'}`}
                >
                  <span className={`${isActive ? 'text-gold' : 'text-foreground/50 group-hover:text-foreground'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="font-bold tracking-widest text-[10px] uppercase flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-foreground/10">
          <div className="lg-card p-4 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full lux-glass flex items-center justify-center text-gold bg-gold/10 font-bold text-sm shrink-0">
              {adminUser?.name.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate">{adminUser?.name || 'Administrator'}</span>
              <span className="text-[10px] text-foreground/50 truncate tracking-wide">{adminUser?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 lg-btn py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-[10px] font-bold tracking-[0.2em] uppercase transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 lg-nav border-b border-foreground/10 sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-foreground/70 hover:text-gold transition-colors p-2 lg-btn !rounded-full"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Breadcrumb based on pathname could go here */}
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="hidden sm:flex lg-btn px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70 hover:text-gold">
              View Storefront
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>

      </div>
    </div>
  );
}
