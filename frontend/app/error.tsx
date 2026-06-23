"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-perfume-main flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Noise & Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

      <div className="lg-card p-8 md:p-12 text-center max-w-lg w-full relative z-10 flex flex-col items-center border-red-500/20 bg-red-500/5">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-serif text-foreground font-bold tracking-widest mb-4">Something went wrong</h1>
        <p className="text-foreground/70 font-medium tracking-wide mb-8 leading-relaxed text-sm">
          We encountered an unexpected issue while loading this page. Please try refreshing or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 lg-btn-primary py-4 text-xs font-bold tracking-widest uppercase flex justify-center items-center gap-2 text-white"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 lg-btn py-4 text-xs font-bold tracking-widest uppercase flex justify-center items-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
