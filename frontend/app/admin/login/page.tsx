"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthService } from "../services/adminAuthService";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Backend retries internally on DB cold-start (~15s), so this may take a moment
      const res = await adminAuthService.login(email, password);
      if (res.success) {
        router.push("/admin/products");
      }
    } catch (err: any) {
      if (err.message === 'Server error') {
        setError("The database is starting up. Please wait a moment and try again.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans px-4">
      <div className="w-full max-w-md bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold tracking-widest text-gradient-gold mb-2">AURIQ ADMIN</h1>
          <p className="text-sm text-foreground/50 tracking-wide">Enter your credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground transition-colors" 
              required 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground transition-colors pr-10" 
                minLength={8}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-foreground/50 hover:text-foreground transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
