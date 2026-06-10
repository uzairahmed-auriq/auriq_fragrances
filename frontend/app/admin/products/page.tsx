"use client";

import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Modal from "../../components/ui/Modal";

export default function AdminProducts() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const products = [
    { id: 1, name: "Royal Oud", category: "Woody", price: "Rs. 15,000", stock: 45, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" },
    { id: 2, name: "Tuscan Leather", category: "Leather", price: "Rs. 12,800", stock: 12, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop" },
    { id: 3, name: "Baccarat Rouge", category: "Oriental", price: "Rs. 18,200", stock: 0, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop" },
    { id: 4, name: "Aventus", category: "Fresh", price: "Rs. 14,000", stock: 89, image: "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop" },
    { id: 5, name: "Oud Wood", category: "Woody", price: "Rs. 16,500", stock: 34, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Products</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage your inventory, pricing, and product details.</p>
        </div>
        <button 
          onClick={() => setIsAddProductOpen(true)}
          className="bg-gold/90 text-background px-6 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-gold transition-colors uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-background rounded-xl p-4 border border-foreground/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80">
            <Filter className="w-4 h-4" /> Category
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-foreground/10 bg-foreground/[0.02] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80">
            <Filter className="w-4 h-4" /> Status
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold w-12">
                  <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                </th>
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                  <td className="p-4">
                    <input type="checkbox" className="accent-gold w-4 h-4 rounded border-foreground/30" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-foreground/5 flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-bold text-foreground tracking-wide">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-foreground/80 font-medium">{product.category}</td>
                  <td className="p-4 font-semibold text-foreground">{product.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${product.stock > 20 ? 'bg-green-500/10 text-green-500' : 
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-red-500/10 text-red-500'}`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
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
          <span>Showing 1 to 5 of 24 products</span>
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
      <Modal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} title="Add New Product" maxWidth="max-w-2xl">
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsAddProductOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Product Name</label>
              <input type="text" placeholder="e.g. Royal Oud" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Category</label>
              <select className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
                <option value="woody">Woody</option>
                <option value="floral">Floral</option>
                <option value="fresh">Fresh</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Price (Rs.)</label>
              <input type="number" placeholder="15000" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Stock Quantity</label>
              <input type="number" placeholder="50" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Image URL</label>
              <input type="url" placeholder="https://..." className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-foreground transition-colors">
            Save Product
          </button>
        </form>
      </Modal>
    </div>
  );
}
