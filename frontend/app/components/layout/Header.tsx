import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/10 transition-all duration-300">
      <AnnouncementBar />
      <div className="container-lux flex items-center justify-between h-20">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
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
            <Link href="#story" className="hover:text-gold transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gold transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="hover:text-gold transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </Link>
            <Link href="/account" aria-label="Profile" className="hover:text-gold transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
