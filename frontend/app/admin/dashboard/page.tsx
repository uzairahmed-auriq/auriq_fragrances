"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";
import { formatPrice } from "../../utils/format";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const res = await apiFetch('/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || "Failed to fetch stats");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 lg-card text-center text-red-400 font-bold border-dashed border-red-500/20 bg-red-500/5">
        <p className="text-sm tracking-wide">{error}</p>
        <button onClick={fetchStats} className="mt-4 lg-btn px-6 py-2 text-[10px] tracking-widest uppercase">Retry</button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      trend: "+12.5%",
      isPositive: true,
      color: "emerald"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-6 h-6 text-gold" />,
      trend: "+5.2%",
      isPositive: true,
      color: "gold"
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: <Users className="w-6 h-6 text-blue-400" />,
      trend: "+18.1%",
      isPositive: true,
      color: "blue"
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <Package className="w-6 h-6 text-purple-400" />,
      trend: "0%",
      isPositive: true,
      color: "purple"
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif text-foreground font-bold tracking-wide">Overview</h1>
          <p className="text-foreground/50 text-sm font-medium tracking-wide mt-2">Welcome to your store dashboard.</p>
        </div>
        <div className="lg-card px-6 py-3 flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Last 30 Days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="lg-stat-card p-6 flex flex-col group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 lux-glass rounded-xl shadow-lg">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold tracking-widest px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">{stat.title}</h3>
              <p className="text-2xl md:text-3xl font-serif font-bold tracking-wide text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Spans 2 columns on large screens */}
        <div className="lg:col-span-2 lux-glass-card p-6 md:p-8 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-8 border-b border-foreground/10 pb-4">
            <h2 className="text-xl font-serif text-foreground font-bold tracking-wide">Recent Orders</h2>
            <button className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold hover:text-foreground transition-colors lg-btn px-4 py-2">View All</button>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar pr-2">
            {stats?.recentOrders?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-foreground/50 text-sm font-medium">No recent orders found.</div>
            ) : (
              <div className="w-full min-w-[600px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold border-b border-foreground/10">
                      <th className="pb-4 pl-4 font-bold">Order ID</th>
                      <th className="pb-4 font-bold">Customer</th>
                      <th className="pb-4 font-bold">Date</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 pr-4 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors group">
                        <td className="py-4 pl-4 font-medium text-sm text-foreground">#AUR-{order.id}</td>
                        <td className="py-4 text-sm text-foreground/80 font-medium">{order.shipping_address?.name || order.user?.name || 'Guest'}</td>
                        <td className="py-4 text-xs text-foreground/60 tracking-wide font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={`lg-badge px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                            order.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-foreground/10 text-foreground/70 border-foreground/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right font-bold text-sm text-foreground">{formatPrice(order.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="lux-glass-card p-6 md:p-8 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-8 border-b border-foreground/10 pb-4">
            <h2 className="text-xl font-serif text-foreground font-bold tracking-wide">Top Products</h2>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar pr-2 flex flex-col gap-6">
            {stats?.topProducts?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-foreground/50 text-sm font-medium">No top products data yet.</div>
            ) : (
              stats?.topProducts?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-background/20 relative border border-foreground/10 shrink-0">
                    <img 
                      src={item.product?.images?.[0]?.image_url || "/placeholder.jpg"} 
                      alt={item.product?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate group-hover:text-gold transition-colors">{item.product?.name || "Unknown Product"}</h4>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold mt-1 mb-1 truncate">{item.product?.brand || "Brand"}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gold font-bold tracking-widest">{item._sum?.quantity || 0} sold</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
