"use client";

import { Search, Filter, Eye, CheckCircle, Truck, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import Modal from "../../components/ui/Modal";

export default function AdminOrders() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const orders = [
    { id: "AUR-84729", customer: "John Doe", email: "john@example.com", date: "Today, 10:23 AM", total: "Rs. 15,000", status: "Processing", items: 1 },
    { id: "AUR-39102", customer: "Sarah Smith", email: "sarah@example.com", date: "Yesterday, 2:45 PM", total: "Rs. 32,500", status: "Shipped", items: 2 },
    { id: "AUR-11029", customer: "Michael Brown", email: "mike@example.com", date: "Yesterday, 9:12 AM", total: "Rs. 12,800", status: "Delivered", items: 1 },
    { id: "AUR-99281", customer: "Emily Davis", email: "emily@example.com", date: "Jun 03, 2026", total: "Rs. 18,200", status: "Pending", items: 1 },
    { id: "AUR-44512", customer: "David Wilson", email: "david@example.com", date: "Jun 01, 2026", total: "Rs. 45,000", status: "Cancelled", items: 3 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-3 h-3" />;
      case 'Shipped': return <Truck className="w-3 h-3" />;
      case 'Processing': return <Clock className="w-3 h-3" />;
      case 'Cancelled': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Orders</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage fulfillments and track order statuses.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-background rounded-xl p-4 border border-foreground/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <input 
            type="text" 
            placeholder="Search by order ID or customer..." 
            className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80">
            <Filter className="w-4 h-4" /> Date
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80">
            <Filter className="w-4 h-4" /> Status
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold w-12">
                  <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                </th>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold text-right">Total</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                  <td className="p-4">
                    <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                  </td>
                  <td className="p-4 font-bold text-foreground">{order.id}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground tracking-wide">{order.customer}</span>
                      <span className="text-xs text-foreground/50">{order.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-foreground/80 font-medium">{order.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5
                      ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' : 
                        order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500' : 
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 
                        'bg-gold/10 text-gold'}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-foreground/80 font-medium">{order.items}</td>
                  <td className="p-4 font-semibold text-foreground text-right">{order.total}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="text-foreground/50 hover:text-gold transition-colors p-2 bg-foreground/5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                      >
                        <Eye className="w-4 h-4" /> Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-foreground/10 flex items-center justify-between text-xs font-medium text-foreground/60">
          <span>Showing 1 to 5 of 124 orders</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-foreground/10 bg-gold/10 text-gold transition-colors">1</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">2</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">3</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Order Status">
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsUpdateModalOpen(false); }}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">New Status</label>
            <select className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-foreground transition-colors">
            Save Status
          </button>
        </form>
      </Modal>
    </div>
  );
}
