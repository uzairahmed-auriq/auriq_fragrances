import Link from "next/link";
import { Search } from "lucide-react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-[80vh] flex items-center justify-center relative overflow-hidden p-4">
        {/* Background Noise & Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="lg-card p-12 text-center max-w-lg w-full relative z-10 flex flex-col items-center">
          <div className="text-[120px] font-serif text-gold/20 font-bold leading-none mb-4 select-none drop-shadow-md">404</div>
          <h1 className="text-3xl font-serif text-foreground font-bold tracking-widest mb-4">Page Not Found</h1>
          <p className="text-foreground/70 font-medium tracking-wide mb-8 leading-relaxed text-sm">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/collections"
              className="w-full lg-btn-primary py-4 text-white text-xs font-bold tracking-widest uppercase flex justify-center items-center gap-2"
            >
              <Search className="w-4 h-4" /> Explore Collections
            </Link>
            <Link
              href="/"
              className="w-full lg-btn py-4 text-xs font-bold tracking-widest uppercase flex justify-center items-center text-foreground"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
