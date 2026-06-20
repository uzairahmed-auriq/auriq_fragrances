"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "../lib/adminFetch";

export default function ShippingPage() {
  const [karachiFee, setKarachiFee] = useState("");
  const [cityFee, setCityFee] = useState("");
  const [freeAbove, setFreeAbove] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/shipping").then((res) => {
      setKarachiFee(res.data.karachi_fee || 200);
      setCityFee(res.data.city_to_city_fee || 500);
      setFreeAbove(res.data.free_shipping_above || 5000);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await adminFetch("/shipping", {
        method: "PUT",
        body: JSON.stringify({
          karachi_fee: Number(karachiFee),
          city_to_city_fee: Number(cityFee),
          free_shipping_above: Number(freeAbove)
        })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-foreground/50 p-8">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Shipping Settings</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">Configure delivery charges for different zones.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* Karachi Zone */}
        <div className="bg-background rounded-xl border border-foreground/10 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-gold"></div>
            <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Within Karachi</h2>
          </div>
          <p className="text-sm text-foreground/50">Delivery fee for orders within Karachi city.</p>
          <div className="flex items-center gap-4">
            <span className="text-foreground/60 text-sm font-bold">Rs.</span>
            <input
              type="number"
              value={karachiFee}
              onChange={(e) => setKarachiFee(e.target.value)}
              className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground w-48"
              placeholder="200"
              min="0"
              required
            />
          </div>
        </div>

        {/* City to City Zone */}
        <div className="bg-background rounded-xl border border-foreground/10 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">City to City</h2>
          </div>
          <p className="text-sm text-foreground/50">Delivery fee for orders outside Karachi (rest of Pakistan).</p>
          <div className="flex items-center gap-4">
            <span className="text-foreground/60 text-sm font-bold">Rs.</span>
            <input
              type="number"
              value={cityFee}
              onChange={(e) => setCityFee(e.target.value)}
              className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground w-48"
              placeholder="500"
              min="0"
              required
            />
          </div>
        </div>

        {/* Free Shipping Threshold */}
        <div className="bg-background rounded-xl border border-foreground/10 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Free Shipping Above</h2>
          </div>
          <p className="text-sm text-foreground/50">Orders above this amount get free shipping.</p>
          <div className="flex items-center gap-4">
            <span className="text-foreground/60 text-sm font-bold">Rs.</span>
            <input
              type="number"
              value={freeAbove}
              onChange={(e) => setFreeAbove(e.target.value)}
              className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none text-foreground w-48"
              placeholder="5000"
              min="0"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-emerald-400 text-sm">Shipping settings saved successfully!</p>}

        <button type="submit" disabled={saving} className="self-start bg-gold/90 text-background px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-foreground transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
