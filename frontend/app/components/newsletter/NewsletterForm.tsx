"use client";

import { useState } from "react";
import { miscService } from "../../services/miscService";
import { Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await miscService.subscribeNewsletter(email);
      setStatus('success');
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || "Something went wrong.");
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-transparent border border-green-700/50 p-3 text-sm flex items-center gap-2 text-green-400">
          <Check className="w-4 h-4" />
          {message}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-transparent border border-gray-700 p-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
        required
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-white text-black py-3 text-sm font-medium hover:bg-gold hover:text-black transition-colors disabled:opacity-70 flex justify-center items-center h-11"
      >
        {status === 'loading' ? (
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "SUBSCRIBE"
        )}
      </button>
      {status === 'error' && (
        <span className="text-red-400 text-xs">{message}</span>
      )}
    </form>
  );
}
