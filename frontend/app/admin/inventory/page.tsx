"use client";

import { useEffect, useState } from "react";
import { adminInventoryService } from "../services/adminInventoryService";
import { AlertCircle, CheckCircle2, AlertTriangle, Search } from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminInventoryService.getInventory()
      .then((data) => {
        setInventory(data);
        setFilteredInventory(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredInventory(inventory);
    } else {
      const q = search.toLowerCase();
      setFilteredInventory(inventory.filter(item => 
        item.productName.toLowerCase().includes(q) || 
        item.sku.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      ));
    }
  }, [search, inventory]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Inventory Management</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Monitor your product stock levels and variants.</p>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-foreground/20 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">SKU</th>
                <th className="p-4 font-bold">Size</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{item.productName}</span>
                      <span className="text-[10px] text-foreground/50 uppercase tracking-widest">{item.brand}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground/70">{item.sku}</td>
                  <td className="p-4 font-medium text-foreground/70">{item.size}ml</td>
                  <td className="p-4 font-bold text-foreground">Rs. {Number(item.price).toLocaleString()}</td>
                  <td className="p-4 font-bold text-foreground">{item.stock}</td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${item.status === 'In Stock' ? 'bg-green-500/10 text-green-500' : 
                        item.status === 'Low Stock' ? 'bg-gold/10 text-gold' : 
                        'bg-red-500/10 text-red-500'}`}
                    >
                      {item.status === 'In Stock' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'Low Stock' && <AlertTriangle className="w-3 h-3" />}
                      {item.status === 'Out of Stock' && <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInventory.length === 0 && (
          <div className="p-8 text-center text-foreground/50 text-sm font-medium">
            No inventory items found.
          </div>
        )}
      </div>
    </div>
  );
}
