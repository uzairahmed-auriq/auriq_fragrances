"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";
import { formatPrice } from "../../utils/format";
import { Plus, Search, Filter, Edit, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/products');
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const res = await apiFetch(`/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert(res.message || "Failed to delete product");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-foreground font-bold tracking-wide">Inventory</h1>
          <p className="text-foreground/50 text-sm font-medium tracking-wide mt-2">Manage your products and stock levels.</p>
        </div>
        <Link 
          href="/admin/inventory/new" 
          className="lg-btn-primary px-6 py-3 text-white text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="lux-glass-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-20">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Search products by name, brand, or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg-input py-3 pl-12 pr-4 text-sm font-medium tracking-wide"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="lg-btn px-4 py-3 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground flex-1 md:flex-none justify-center">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lux-glass-card flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-foreground/50 border-dashed border-foreground/10 border m-4 rounded-xl">
            <Package className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm font-medium tracking-wide">No products found. Adjust your search or add a new product.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold border-b border-foreground/10 bg-foreground/[0.02]">
                  <th className="p-4 pl-6 font-bold w-16">Image</th>
                  <th className="p-4 font-bold">Product Name</th>
                  <th className="p-4 font-bold">Brand</th>
                  <th className="p-4 font-bold">Base Price</th>
                  <th className="p-4 font-bold">Variants</th>
                  <th className="p-4 pr-6 text-right font-bold w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder.jpg";
                  
                  return (
                    <tr key={product.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="w-12 h-12 rounded bg-background/20 overflow-hidden relative border border-foreground/10">
                          <Image src={primaryImage} alt={product.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground group-hover:text-gold transition-colors">{product.name}</span>
                          <span className="text-[10px] text-foreground/50 tracking-widest mt-1">ID: {product.id} {product.sku && `• SKU: ${product.sku}`}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground/80">{product.brand}</td>
                      <td className="p-4 font-bold text-sm text-foreground">{formatPrice(product.base_price)}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {product.variants?.map((v: any) => (
                            <span key={v.id} className="lg-badge px-2 py-0.5 text-[10px] font-bold tracking-widest text-foreground/60 bg-foreground/5 border-foreground/10">
                              {v.size_ml}ml
                            </span>
                          ))}
                          {(!product.variants || product.variants.length === 0) && <span className="text-xs text-foreground/40">No variants</span>}
                        </div>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/inventory/${product.id}`}
                            className="p-2 lg-btn !rounded-xl text-foreground/70 hover:text-gold transition-colors"
                            aria-label="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 lg-btn !rounded-xl text-foreground/70 hover:text-red-400 transition-colors"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
