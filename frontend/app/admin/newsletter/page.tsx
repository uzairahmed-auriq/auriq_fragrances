"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../lib/adminFetch";
import { Trash2, Download, Send } from "lucide-react";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [campaignResult, setCampaignResult] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/newsletters?limit=100');
      setSubscribers(res.data);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this subscriber?')) return;
    try {
      await adminFetch(`/newsletters/${id}`, { method: 'DELETE' });
      setSubscribers(prev => prev.filter(s => s.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      alert('Failed to delete subscriber');
    }
  };

  const handleExport = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/newsletters/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscribers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export');
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Send campaign to ${total} subscribers?`)) return;
    setSending(true);
    setCampaignResult('');
    try {
      const res = await adminFetch('/newsletters/campaign', {
        method: 'POST',
        body: JSON.stringify({ subject, message })
      });
      setCampaignResult(res.message);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setCampaignResult(err.message || 'Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Newsletter</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">{total} subscribers</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 border border-foreground/20 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Send Campaign */}
      <div className="bg-background rounded-xl border border-foreground/10 p-6">
        <h2 className="text-lg font-serif font-bold text-foreground mb-6 flex items-center gap-2">
          <Send className="w-5 h-5 text-gold" /> Send Campaign
        </h2>
        <form onSubmit={handleSendCampaign} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. New Collection Launch" required className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your campaign message..." rows={5} required className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground resize-none" />
          </div>
          {campaignResult && <p className={`text-sm ${campaignResult.includes('sent') ? 'text-emerald-400' : 'text-red-400'}`}>{campaignResult}</p>}
          <button type="submit" disabled={sending || total === 0} className="self-start bg-gold/90 text-background px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-foreground transition-colors disabled:opacity-50">
            {sending ? 'Sending...' : `Send to ${total} Subscribers`}
          </button>
        </form>
      </div>

      {/* Subscribers List */}
      <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden">
        <div className="p-4 border-b border-foreground/10">
          <h2 className="text-lg font-serif font-bold text-foreground">Subscribers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Subscribed</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="text-center py-12 text-foreground/50">Loading...</td></tr>
              ) : subscribers.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-12 text-foreground/50">No subscribers yet.</td></tr>
              ) : subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] text-sm">
                  <td className="p-4 text-foreground font-medium">{sub.email}</td>
                  <td className="p-4 text-foreground/60 text-xs">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(sub.id)} className="text-foreground/40 hover:text-red-500 transition-colors p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
