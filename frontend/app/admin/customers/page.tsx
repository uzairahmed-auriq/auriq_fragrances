import { Search, Filter, Mail, Edit, Trash2 } from "lucide-react";

export default function AdminCustomers() {
  const customers = [
    { id: "CUST-001", name: "John Doe", email: "john@example.com", phone: "+1 (555) 123-4567", orders: 12, totalSpent: "Rs. 185,000", joined: "Jan 15, 2026" },
    { id: "CUST-002", name: "Sarah Smith", email: "sarah@example.com", phone: "+1 (555) 987-6543", orders: 3, totalSpent: "Rs. 45,000", joined: "Mar 02, 2026" },
    { id: "CUST-003", name: "Michael Brown", email: "mike@example.com", phone: "+1 (555) 456-7890", orders: 8, totalSpent: "Rs. 120,500", joined: "Feb 20, 2026" },
    { id: "CUST-004", name: "Emily Davis", email: "emily@example.com", phone: "+1 (555) 234-5678", orders: 1, totalSpent: "Rs. 18,200", joined: "Jun 03, 2026" },
    { id: "CUST-005", name: "David Wilson", email: "david@example.com", phone: "+1 (555) 876-5432", orders: 5, totalSpent: "Rs. 75,000", joined: "May 10, 2026" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Customers</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">View and manage your registered customer base.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-background rounded-xl p-4 border border-foreground/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80">
            <Filter className="w-4 h-4" /> Sort By
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold w-12">
                  <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                </th>
                <th className="p-4 font-bold">Customer Name</th>
                <th className="p-4 font-bold">Contact Info</th>
                <th className="p-4 font-bold">Orders</th>
                <th className="p-4 font-bold">Total Spent</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                  <td className="p-4">
                    <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-xs font-bold text-gold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-bold text-foreground tracking-wide">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${customer.email}`} className="text-foreground/80 hover:text-gold transition-colors font-medium flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {customer.email}
                      </a>
                      <span className="text-xs text-foreground/50">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-foreground/80 font-medium">{customer.orders}</td>
                  <td className="p-4 font-semibold text-gold">{customer.totalSpent}</td>
                  <td className="p-4 text-foreground/60">{customer.joined}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-foreground/50 hover:text-gold transition-colors p-2 bg-foreground/5 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-foreground/50 hover:text-red-500 transition-colors p-2 bg-foreground/5 rounded-lg">
                        <Trash2 className="w-4 h-4" />
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
          <span>Showing 1 to 5 of 86 customers</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded border border-foreground/10 bg-gold/10 text-gold transition-colors">1</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">2</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">3</button>
            <button className="px-3 py-1 rounded border border-foreground/10 hover:border-gold transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
