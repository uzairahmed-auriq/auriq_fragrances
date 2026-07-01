"use client";

import { Search, Eye, CheckCircle, Truck, Clock, XCircle, Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import { adminOrderService } from "../services/adminOrderService";

export default function AdminOrders() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !search || order.id.toString().includes(search) || (order.user?.name || order.user?.email || order.guest_email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || new Date(order.created_at).toISOString().slice(0, 10) === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminOrderService.getAll();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (order: any) => {
    if (!confirm(`Delete order AUR-${order.id}? This cannot be undone.`)) return;
    try {
      await adminOrderService.deleteOrder(order.id);
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setUpdating(true);
    const form = e.currentTarget;
    const status = (form.elements.namedItem("status") as HTMLSelectElement).value;
    
    try {
      const res = await adminOrderService.updateStatus(selectedOrder.id, status);
      if (res.success) {
        setIsUpdateModalOpen(false);
        fetchOrders();
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating order status.");
    } finally {
      setUpdating(false);
    }
  };

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
            placeholder="Search by order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="flex-1 md:flex-none border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80 focus:outline-none focus:border-gold" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 md:flex-none border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80 focus:outline-none focus:border-gold bg-background">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="WAREHOUSE">Warehouse</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : (
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-foreground/50 text-sm">
                      No orders found.
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => {
                  const statusFormatted = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                  return (
                    <tr key={order.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                      <td className="p-4">
                        <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                      </td>
                      <td className="p-4 font-bold text-foreground">AUR-{order.id}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground tracking-wide">{order.user?.first_name} {order.user?.last_name}</span>
                          <span className="text-xs text-foreground/50">{order.user?.email || "Guest"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground/80 font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5
                          ${statusFormatted === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                            statusFormatted === 'Processing' ? 'bg-blue-500/10 text-blue-500' : 
                            statusFormatted === 'Shipped' ? 'bg-purple-500/10 text-purple-500' : 
                            statusFormatted === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 
                            'bg-gold/10 text-gold'}`}
                        >
                          {getStatusIcon(statusFormatted)}
                          {statusFormatted}
                        </span>
                      </td>
                      <td className="p-4 text-foreground/80 font-medium">{order.items?.length || 0}</td>
                      <td className="p-4 font-semibold text-foreground text-right">Rs. {Number(order.total).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setSelectedOrder(order); setIsUpdateModalOpen(true); }}
                            className="text-foreground/50 hover:text-gold transition-colors p-2 bg-foreground/5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                          >
                            <Eye className="w-4 h-4" /> Update
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="text-foreground/40 hover:text-red-500 transition-colors p-2 bg-foreground/5 rounded-lg"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-foreground/10 flex items-center justify-between text-xs font-medium text-foreground/60">
          <span>Showing {orders.length} orders</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-foreground/10 bg-gold/10 text-gold transition-colors">1</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => { setIsUpdateModalOpen(false); setSelectedOrder(null); }} title={`Update Order AUR-${selectedOrder?.id}`}>
        <form className="flex flex-col gap-6" onSubmit={handleUpdateStatus}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">New Status</label>
            <select name="status" defaultValue={selectedOrder?.status || 'Processing'} className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button type="submit" disabled={updating} className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-foreground transition-colors disabled:opacity-50">
            {updating ? "Saving..." : "Save Status"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
