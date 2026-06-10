"use client";

import { useState } from "react";
import { User, Mail, Lock, ShieldCheck, Save } from "lucide-react";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Settings</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage your administrator profile and security preferences.</p>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-foreground/10 p-6 bg-foreground/[0.02]">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'profile' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <User className="w-4 h-4" /> Profile Info
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === 'security' ? 'bg-gold/10 text-gold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
            >
              <ShieldCheck className="w-4 h-4" /> Security
            </button>
          </nav>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            
            {activeTab === 'profile' && (
              <>
                {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-8 border-b border-foreground/10">
              <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/50 flex items-center justify-center text-2xl font-bold text-gold">
                A
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" className="px-4 py-2 border border-foreground/20 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground">
                  Change Avatar
                </button>
                <span className="text-[10px] text-foreground/50 tracking-wide">JPG, GIF or PNG. Max size of 800K</span>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input 
                  type="text" 
                  defaultValue="Admin User"
                  className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide w-full" 
                />
              </div>

              <div className="flex flex-col gap-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input 
                  type="email" 
                  defaultValue="admin@auriqfragrances.com"
                  className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide w-full" 
                />
              </div>

              <div className="flex flex-col gap-2 group md:col-span-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors">
                  Bio / Role Description
                </label>
                <textarea 
                  rows={4}
                  defaultValue="Super Administrator for Auriq platform. Responsible for overarching store management, order fulfillment, and system settings."
                  className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide w-full resize-none" 
                />
              </div>
              </div>
            </>
            )}

            {activeTab === 'security' && (
              <>
            {/* Password Reset Area */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-serif font-bold text-foreground tracking-wide">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Current Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide w-full" 
                  />
                </div>
                <div className="flex flex-col gap-2 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors flex items-center gap-2">
                    <Lock className="w-3 h-3" /> New Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide w-full" 
                  />
                </div>
              </div>
            </div>
              </>
            )}

            <div className="flex justify-end pt-8 mt-4 border-t border-foreground/10">
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-gold/90 text-background px-8 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-gold transition-colors uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
