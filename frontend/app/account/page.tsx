"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, LogOut, Package, MapPin, CreditCard, Clock, ChevronRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // --- LOGGED OUT STATE UI ---
  const LoggedOutView = () => (
    <div className="container-lux pt-16 pb-24">
      <div className="text-center mb-16">
        <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Membership</span>
        <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-widest mb-6">Auriq Exclusives</h1>
        <p className="text-foreground/60 max-w-xl mx-auto">
          Sign in or create an account to manage your orders, save your favorite fragrances, and receive exclusive access to new launches.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-24 max-w-5xl mx-auto">
        {/* Sign In Form */}
        <div className="flex-1 lux-glass-card p-8 md:p-12 relative z-10">
          <h2 className="text-2xl font-serif text-foreground mb-8 font-bold border-b border-foreground/10 pb-4">Sign In</h2>
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
            <div className="flex flex-col gap-3 group">
              <label htmlFor="login-email" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="email"
                  id="login-email"
                  className="w-full bg-transparent border-b border-foreground/10 py-2 pl-8 text-sm focus:outline-none focus:border-gold transition-colors text-foreground"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 group">
              <label htmlFor="login-password" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="password"
                  id="login-password"
                  className="w-full bg-transparent border-b border-foreground/10 py-2 pl-8 text-sm focus:outline-none focus:border-gold transition-colors text-foreground"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-xs text-foreground/50 hover:text-gold transition-colors">Forgot Password?</Link>
            </div>

            <button type="submit" className="w-full bg-gold text-background py-4 mt-4 font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors">
              Sign In
            </button>
          </form>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-foreground/10"></div>

        {/* Register Form */}
        <div className="flex-1 p-8 md:p-12 relative z-10 border border-foreground/5 bg-foreground/[0.02]">
          <h2 className="text-2xl font-serif text-foreground mb-8 font-bold border-b border-foreground/10 pb-4">Create Account</h2>
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 group">
                <label htmlFor="reg-first" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">First Name</label>
                <input type="text" id="reg-first" className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
              </div>
              <div className="flex flex-col gap-3 group">
                <label htmlFor="reg-last" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Last Name</label>
                <input type="text" id="reg-last" className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label htmlFor="reg-email" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email Address</label>
              <input type="email" id="reg-email" className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
            </div>

            <div className="flex flex-col gap-3 group">
              <label htmlFor="reg-password" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Password</label>
              <input type="password" id="reg-password" className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
            </div>

            <button type="submit" className="w-full border border-foreground/20 text-foreground py-4 mt-4 font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // --- LOGGED IN STATE UI ---
  const LoggedInView = () => (
    <div className="container-lux pt-12 pb-24">
      
      {/* Dashboard Header */}
      <div className="mb-12 border-b border-foreground/10 pb-6 flex items-end justify-between">
        <div>
          <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Welcome Back</span>
          <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest">Hussain Ali</h1>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="hidden md:flex items-center gap-2 text-foreground/50 hover:text-red-400 transition-colors text-xs font-bold tracking-[0.2em] uppercase"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between p-4 border border-foreground/10 transition-colors ${activeTab === 'orders' ? 'bg-gold/10 border-gold text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Order History</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-between p-4 border border-foreground/10 transition-colors ${activeTab === 'profile' ? 'bg-gold/10 border-gold text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Profile Details</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center justify-between p-4 border border-foreground/10 transition-colors ${activeTab === 'addresses' ? 'bg-gold/10 border-gold text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Addresses</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex md:hidden items-center justify-between p-4 border border-foreground/10 text-foreground/60 hover:text-red-400 hover:bg-foreground/5 transition-colors mt-8"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Sign Out</span>
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lux-glass-card p-8 min-h-[400px]">
          
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6 relative z-10">
              <h2 className="text-2xl font-serif text-foreground mb-2 font-bold">Order History</h2>
              
              {/* Mock Order Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground/80">
                  <thead className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 border-b border-foreground/10">
                    <tr>
                      <th className="pb-4 font-bold">Order #</th>
                      <th className="pb-4 font-bold">Date</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 font-bold">Total</th>
                      <th className="pb-4 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-6 font-medium text-foreground">#AQ-8932</td>
                      <td className="py-6">Oct 12, 2025</td>
                      <td className="py-6"><span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Delivered</span></td>
                      <td className="py-6 text-foreground font-medium">Rs. 34,000</td>
                      <td className="py-6 text-right"><Link href="#" className="text-gold hover:underline text-xs tracking-widest uppercase">View</Link></td>
                    </tr>
                    <tr className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-6 font-medium text-foreground">#AQ-7410</td>
                      <td className="py-6">Aug 05, 2025</td>
                      <td className="py-6"><span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Delivered</span></td>
                      <td className="py-6 text-foreground font-medium">Rs. 15,000</td>
                      <td className="py-6 text-right"><Link href="#" className="text-gold hover:underline text-xs tracking-widest uppercase">View</Link></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6 relative z-10 max-w-xl">
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">Profile Details</h2>
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">First Name</label>
                    <input type="text" defaultValue="Hussain" className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" />
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Last Name</label>
                    <input type="text" defaultValue="Ali" className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email Address</label>
                  <input type="email" defaultValue="hussain@example.com" className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" />
                </div>
                <button type="button" className="w-fit bg-gold text-background px-8 py-3 mt-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-foreground font-bold">Saved Addresses</h2>
                <button className="text-gold text-xs tracking-widest uppercase hover:underline">Add New</button>
              </div>
              
              <div className="border border-gold p-6 relative">
                <div className="absolute top-0 right-0 bg-gold text-background text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Default</div>
                <h3 className="text-foreground font-bold mb-2 tracking-wide">Hussain Ali</h3>
                <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                  123 Luxury Avenue, Suite 400<br />
                  Karachi, Sindh 74000<br />
                  Pakistan
                </p>
                <div className="flex gap-4">
                  <button className="text-xs text-foreground hover:text-gold uppercase tracking-widest">Edit</button>
                  <button className="text-xs text-foreground/40 hover:text-red-400 uppercase tracking-widest">Delete</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden">
        {/* Global Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        
        {isLoggedIn ? <LoggedInView /> : <LoggedOutView />}
      </main>
      <Footer />
    </>
  );
}
