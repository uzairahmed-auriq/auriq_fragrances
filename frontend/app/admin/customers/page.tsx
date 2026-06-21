"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { adminFetch } from "../lib/adminFetch";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCustomers = async (p = 1, s = "") => {
    setLoading(true);
    try {
      const res = await adminFetch(`/customers?page=${p}&limit=20&search=${s}`);
      setCustomers(res.data);
      setTotalPages(res.pagination.pages);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchCustomers(1, e.target.value);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Customers</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">View and manage your registered customer base.</p>
      </div>

      <div className="bg-background rounded-xl p-4 border border-foreground/10 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={handleSearch} className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
        <span className="text-xs text-foreground/50 font-medium">{total} customers</span>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Orders</th>
                <th className="p-4 font-bold">Total Spent</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-foreground/50">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-foreground/50">No customers found.</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                        {(c.name || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-foreground">{c.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-foreground/70">
                    <div>{c.email}</div>
                    {c.phone && <div className="text-xs text-foreground/40">{c.phone}</div>}
                  </td>
                  <td className="p-4 text-foreground/70">{c.total_orders}</td>
                  <td className="p-4 font-semibold text-foreground">Rs. {Number(c.total_spent).toLocaleString()}</td>
                  <td className="p-4 text-foreground/60 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${c.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-foreground/10">
            <span className="text-xs text-foreground/50">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => { setPage(p => p - 1); fetchCustomers(page - 1, search); }} disabled={page === 1} className="px-3 py-1 border border-foreground/20 rounded text-xs font-bold disabled:opacity-50 hover:border-gold transition-colors">Prev</button>
              <button onClick={() => { setPage(p => p + 1); fetchCustomers(page + 1, search); }} disabled={page === totalPages} className="px-3 py-1 border border-foreground/20 rounded text-xs font-bold disabled:opacity-50 hover:border-gold transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
