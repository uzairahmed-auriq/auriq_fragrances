import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Revenue", value: "Rs. 452,000", change: "+12.5%", icon: DollarSign },
    { name: "Total Orders", value: "124", change: "+8.2%", icon: ShoppingCart },
    { name: "Total Customers", value: "86", change: "+14.1%", icon: Users },
    { name: "Total Products", value: "24", change: "0%", icon: Package },
  ];

  const recentOrders = [
    { id: "AUR-84729", customer: "John Doe", date: "Today", total: "Rs. 15,000", status: "Processing" },
    { id: "AUR-39102", customer: "Sarah Smith", date: "Yesterday", total: "Rs. 32,500", status: "Shipped" },
    { id: "AUR-11029", customer: "Michael Brown", date: "Yesterday", total: "Rs. 12,800", status: "Delivered" },
    { id: "AUR-99281", customer: "Emily Davis", date: "Jun 03", total: "Rs. 18,200", status: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Dashboard</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-background rounded-xl p-6 border border-foreground/10 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">{stat.name}</span>
              <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-gold" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-foreground tracking-wide">{stat.value}</span>
              <span className={`text-xs font-semibold mb-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-foreground/40'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-background rounded-xl border border-foreground/10 shadow-sm flex flex-col">
          <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-gold hover:text-foreground tracking-widest uppercase transition-colors">
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm">
                    <td className="p-4 font-semibold text-foreground">{order.id}</td>
                    <td className="p-4 text-foreground/80 font-medium">{order.customer}</td>
                    <td className="p-4 text-foreground/60">{order.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                          order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' : 
                          order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500' : 
                          'bg-gold/10 text-gold'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-foreground text-right">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-background rounded-xl border border-foreground/10 shadow-sm flex flex-col">
          <div className="p-6 border-b border-foreground/10">
            <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Quick Actions</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <Link href="/admin/products" className="flex items-center gap-4 p-4 rounded-lg border border-foreground/10 hover:border-gold hover:bg-gold/5 transition-all group">
              <div className="w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                <Package className="w-5 h-5 text-foreground/70 group-hover:text-gold transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground tracking-wide">Add Product</span>
                <span className="text-xs text-foreground/60 font-medium">Create a new listing</span>
              </div>
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-4 p-4 rounded-lg border border-foreground/10 hover:border-gold hover:bg-gold/5 transition-all group">
              <div className="w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                <TrendingUp className="w-5 h-5 text-foreground/70 group-hover:text-gold transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground tracking-wide">Fulfill Orders</span>
                <span className="text-xs text-foreground/60 font-medium">4 orders pending</span>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
