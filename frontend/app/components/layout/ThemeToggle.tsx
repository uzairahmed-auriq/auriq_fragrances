"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5" />; // Placeholder to avoid layout shift
  }

  return (
    <button
      aria-label="Toggle Theme"
      className="hover:text-gold transition-colors flex items-center justify-center"
      onClick={() => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        // @ts-ignore - startViewTransition is not fully typed in all environments yet
        if (!document.startViewTransition) {
          setTheme(nextTheme);
          return;
        }
        // @ts-ignore
        document.startViewTransition(() => {
          setTheme(nextTheme);
        });
      }}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
