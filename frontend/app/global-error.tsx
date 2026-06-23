"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="min-h-screen bg-perfume-main flex items-center justify-center relative overflow-hidden p-4">
          {/* Background Noise & Overlay */}
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

          <div className="p-8 md:p-12 text-center max-w-lg w-full relative z-10 flex flex-col items-center border border-red-500/20 bg-red-500/5 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-serif text-foreground font-bold tracking-widest mb-4">Critical Error</h1>
            <p className="text-foreground/70 font-medium tracking-wide mb-8 leading-relaxed text-sm">
              We encountered a critical issue while loading the application layout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => reset()}
                className="flex-1 py-4 px-6 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-bold tracking-widest uppercase flex justify-center items-center gap-2 text-red-400 rounded-xl transition-colors"
              >
                <RefreshCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
