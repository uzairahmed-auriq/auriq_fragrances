"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { API_URL } from "../../utils/api";

export default function ContactFeedback() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>

      <div className="container-lux relative z-10">
        <div className="text-center mb-24">
          <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Concierge</span>
          <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold mb-6 font-bold tracking-wide drop-shadow-md">Get In Touch</h2>
          <div className="w-16 h-[2px] mx-auto bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-serif text-foreground mb-8 font-bold drop-shadow-sm">We are here for you</h3>
            <p className="text-foreground/80 mb-12 leading-relaxed text-sm font-semibold tracking-wide">
              Whether you have a question about our exquisite collections, need assistance with an order, or simply wish to share your experience, our dedicated team is at your service.
            </p>
            <div className="flex flex-col gap-10">
              <div className="flex items-start gap-6 group">
                <div className="mt-1 text-gold group-hover:text-foreground transition-colors"><Mail className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-[10px] text-foreground/60 tracking-[0.2em] uppercase mb-2 font-bold">Email</h4>
                  <a href="mailto:uzairahmed@auriqfragnaces.com" className="text-foreground hover:text-gold transition-colors text-sm font-semibold tracking-wide">uzairahmed@auriqfragnaces.com</a>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="mt-1 text-gold group-hover:text-foreground transition-colors"><Phone className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-[10px] text-foreground/60 tracking-[0.2em] uppercase mb-2 font-bold">Phone</h4>
                  <a href="tel:+923300383666" className="text-foreground hover:text-gold transition-colors text-sm font-semibold tracking-wide">+92 330 0383666</a>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="mt-1 text-gold group-hover:text-foreground transition-colors"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-[10px] text-foreground/60 tracking-[0.2em] uppercase mb-2 font-bold">Address</h4>
                  <address className="not-italic text-foreground text-sm leading-loose font-semibold tracking-wide">
                    Sindh madrasa tul islamia<br />Garikhata Karachi, 74000<br />Pakistan
                  </address>
                </div>
              </div>
            </div>
          </div>

          <div className="lux-glass-card p-10 md:p-14">
            <div className="relative z-10">
              {success ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                  <p className="text-emerald-400 text-lg font-serif font-bold">Message Sent!</p>
                  <p className="text-foreground/60 text-sm">We will get back to you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="mt-4 text-xs text-gold underline tracking-widest uppercase">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3 group">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Name</label>
                      <input type="text" id="name" value={form.name} onChange={handleChange} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-light tracking-wide" placeholder="Your full name" required />
                    </div>
                    <div className="flex flex-col gap-3 group">
                      <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email</label>
                      <input type="email" id="email" value={form.email} onChange={handleChange} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-light tracking-wide" placeholder="Your email address" required />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <label htmlFor="subject" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Subject</label>
                    <input type="text" id="subject" value={form.subject} onChange={handleChange} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/20 text-foreground font-light tracking-wide" placeholder="How can we help?" required />
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Message</label>
                    <textarea id="message" value={form.message} onChange={handleChange} rows={4} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-foreground/20 text-foreground font-light tracking-wide" placeholder="Your message..." required></textarea>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" disabled={isSubmitting} className="mt-6 w-full bg-gold text-background py-4 text-xs font-bold tracking-[0.2em] hover:bg-foreground transition-all duration-300 disabled:opacity-50">
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
