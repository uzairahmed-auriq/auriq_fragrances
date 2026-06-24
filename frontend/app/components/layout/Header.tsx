"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('auriqAccessToken');
      const storedUser = localStorage.getItem('auriqUser');
      if (token && storedUser) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user");
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    window.addEventListener('loginStateChange', checkLogin);
    
    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('loginStateChange', checkLogin);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('auriqRefreshToken');
      if (refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      setIsDropdownOpen(false);
      router.push('/');
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const hero = document.getElementById('hero');
      const header = document.querySelector('header');
      if (hero && header) {
        const headerHeight = header.offsetHeight;
        const elementPosition = hero.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/10 transition-all duration-300">
      <AnnouncementBar />
      <div className="container-lux flex items-center justify-between h-20">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/#hero" onClick={handleLogoClick} className="flex items-center gap-3">
            <Image src="/icon.svg" alt="Auriq Logo" width={40} height={40} className="w-10 h-10 object-cover rounded-full bg-black/20" priority />
            <span className="text-2xl font-serif tracking-widest font-bold hidden sm:block">AURIQ</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search fragrances..."
              className="w-full bg-transparent border border-foreground/20 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) window.location.href = `/collections?search=${encodeURIComponent(val)}`;
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
          </div>
        </div>

        {/* Right: Nav & Icons */}
        <nav className="flex items-center gap-6 text-sm tracking-wide">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <Link href="/collections" className="hover:text-gold transition-colors">All Collections</Link>
            <Link href="/collections?sort=new-arrivals" className="hover:text-gold transition-colors">New Arrivals</Link>
            <Link href="/collections?sort=best-sellers" className="hover:text-gold transition-colors">Best Sellers</Link>
            <Link href="/about" className="hover:text-gold transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gold transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="hover:text-gold transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Profile Menu" 
                  className={`transition-colors flex items-center ${isDropdownOpen ? 'text-gold' : 'hover:text-gold'}`}
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <Link href="/account" aria-label="Profile" className="hover:text-gold transition-colors flex items-center">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Dropdown Menu */}
              {isLoggedIn && isDropdownOpen && (
                <div className="absolute right-0 top-full mt-6 w-56 lux-glass-card shadow-2xl p-2 flex flex-col gap-1 border border-foreground/10 animate-in fade-in slide-in-from-top-2 duration-200 text-foreground z-50">
                  <div className="px-4 py-3 border-b border-foreground/10 mb-1">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-1">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{user?.name || "Welcome"}</p>
                  </div>
                  <Link href="/account?tab=profile" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm hover:bg-foreground/5 hover:text-gold transition-colors text-left flex items-center gap-3 rounded">
                    Edit Profile
                  </Link>
                  <Link href="/account?tab=addresses" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm hover:bg-foreground/5 hover:text-gold transition-colors text-left flex items-center gap-3 rounded">
                    Addresses
                  </Link>
                  <Link href="/account?tab=orders" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm hover:bg-foreground/5 hover:text-gold transition-colors text-left flex items-center gap-3 rounded">
                    Track Orders
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2.5 mt-1 border-t border-foreground/10 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-bold tracking-wide rounded">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
