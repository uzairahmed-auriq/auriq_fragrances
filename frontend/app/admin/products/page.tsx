"use client";

import { Plus, Edit, Trash2, Search, Filter, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import { adminProductService } from "../services/adminProductService";

export default function AdminProducts() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [add50, setAdd50] = useState(false);
  const [add100, setAdd100] = useState(true);
  const [edit50, setEdit50] = useState(false);
  const [edit100, setEdit100] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    id?: number;
  }>({ isOpen: false, type: 'single' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminProductService.getAll();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err: any) {
      console.warn("Network or API Error:", err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (editingProduct) {
      const v50 = editingProduct.variants?.find((v: any) => v.size_ml === 50 && v.is_active !== false);
      const v100 = editingProduct.variants?.find((v: any) => v.size_ml === 100 && v.is_active !== false);
      setEdit50(!!v50);
      setEdit100(!!v100);
    }
  }, [editingProduct]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id.toString() === categoryFilter;
    const matchesType = !typeFilter || p.fragrance_type === typeFilter;
    const matchesStatus = !statusFilter || (statusFilter === "active" ? p.is_active : !p.is_active);
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmDeleteSingle = (id: number) => {
    setDeleteConfirmation({ isOpen: true, type: 'single', id });
  };

  const confirmDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmation({ isOpen: true, type: 'bulk' });
  };

  const executeDelete = async () => {
    try {
      setIsDeleting(true);
      if (deleteConfirmation.type === 'single' && deleteConfirmation.id) {
        const res = await adminProductService.delete(deleteConfirmation.id);
        if (res.success) {
          setProducts(products.filter(p => p.id !== deleteConfirmation.id));
          setSelectedIds(prev => prev.filter(item => item !== deleteConfirmation.id));
        }
      } else if (deleteConfirmation.type === 'bulk') {
        const res = await adminProductService.bulkDelete(selectedIds);
        if (res.success) {
          setProducts(products.filter(p => !selectedIds.includes(p.id)));
          setSelectedIds([]);
        }
      }
      setDeleteConfirmation({ isOpen: false, type: 'single' });
    } catch (err) {
      console.error(err);
      setError("Failed to delete product(s)");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // Inject standard values required by backend
      formData.append("brand", "Auriq");
      formData.append("is_active", "true");
      
      const variants = [];
      if (add50) {
        variants.push({ size_ml: 50, price: Number(formData.get("price_50")), stock_quantity: Number(formData.get("stock_50")), sku: `AQ-50-${Math.floor(Math.random() * 10000)}` });
      }
      if (add100) {
        variants.push({ size_ml: 100, price: Number(formData.get("price_100")), stock_quantity: Number(formData.get("stock_100")), sku: `AQ-100-${Math.floor(Math.random() * 10000)}` });
      }
      if (variants.length === 0) { setError("Enable at least one size option"); setSaving(false); return; }
      formData.append("variants_json", JSON.stringify(variants));
      ['price_50','stock_50','price_100','stock_100'].forEach(k => formData.delete(k));

      const notes = [];
      const top = formData.get('top_notes'); if (top) notes.push({ note_type: 'TOP', note_name: top });
      const heart = formData.get('heart_notes'); if (heart) notes.push({ note_type: 'HEART', note_name: heart });
      const base = formData.get('base_notes'); if (base) notes.push({ note_type: 'BASE', note_name: base });
      formData.append('notes_json', JSON.stringify(notes));
      ['top_notes','heart_notes','base_notes'].forEach(k => formData.delete(k));

      const catGender: Record<string, string> = { '1': 'MALE', '2': 'FEMALE', '3': 'UNISEX' };
      formData.append('gender', catGender[formData.get('category_id') as string] || 'UNISEX');

      const res = await adminProductService.create(formData);
      if (res.success) {
        setIsAddProductOpen(false);
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!editingProduct) return;
  setSaving(true);
  setError("");

  try {
    const form = e.currentTarget;
    const formData = new FormData(form);

    const existingVariants = editingProduct.variants || [];
    const find = (ml: number) => existingVariants.find((v: any) => v.size_ml === ml);
    const variants = [];

    const v50 = find(50);
    if (edit50) {
      variants.push({ ...(v50 ? { id: v50.id } : { sku: `AQ-50-${Math.floor(Math.random() * 10000)}` }), size_ml: 50, price: Number(formData.get("price_50")), stock_quantity: Number(formData.get("stock_50")), is_active: true });
    } else if (v50) {
      variants.push({ id: v50.id, size_ml: 50, price: Number(v50.price), stock_quantity: v50.stock_quantity, is_active: false });
    }

    const v100 = find(100);
    if (edit100) {
      variants.push({ ...(v100 ? { id: v100.id } : { sku: `AQ-100-${Math.floor(Math.random() * 10000)}` }), size_ml: 100, price: Number(formData.get("price_100")), stock_quantity: Number(formData.get("stock_100")), is_active: true });
    } else if (v100) {
      variants.push({ id: v100.id, size_ml: 100, price: Number(v100.price), stock_quantity: v100.stock_quantity, is_active: false });
    }

    formData.append("variants_json", JSON.stringify(variants));
    ['price_50','stock_50','price_100','stock_100'].forEach(k => formData.delete(k));

    const notes = [];
    const top = formData.get('top_notes'); if (top) notes.push({ note_type: 'TOP', note_name: top });
    const heart = formData.get('heart_notes'); if (heart) notes.push({ note_type: 'HEART', note_name: heart });
    const base = formData.get('base_notes'); if (base) notes.push({ note_type: 'BASE', note_name: base });
    formData.append('notes_json', JSON.stringify(notes));
    ['top_notes','heart_notes','base_notes'].forEach(k => formData.delete(k));

    const catGender: Record<string, string> = { '1': 'MALE', '2': 'FEMALE', '3': 'UNISEX' };
    formData.append('gender', catGender[formData.get('category_id') as string] || 'UNISEX');

    const res = await adminProductService.update(editingProduct.id, formData);
    if (res.success) {
      setEditingProduct(null);
      fetchProducts();
    }
  } catch (err: any) {
    setError(err.message || "Failed to update product");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Products</h1>
          <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage your inventory, pricing, and product details.</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={confirmDeleteBulk}
              disabled={isDeleting}
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-red-500 hover:text-white transition-colors uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => setIsAddProductOpen(true)}
            className="bg-gold/90 text-background px-6 py-3 rounded-lg text-sm font-bold tracking-widest hover:bg-gold transition-colors uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

{/* filteredProducts computed inline */}
      {/* Filters & Search */}
      <div className="bg-background rounded-xl p-4 border border-foreground/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <input 
            type="text" 
            placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors text-sm font-medium"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="flex-1 md:flex-none border border-foreground/10 bg-background px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80 focus:outline-none focus:border-gold">
            <option value="">All Categories</option>
            <option value="1">Men</option>
            <option value="2">Women</option>
            <option value="3">Unisex</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="flex-1 md:flex-none border border-foreground/10 bg-background px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80 focus:outline-none focus:border-gold">
            <option value="">All Types</option>
            <option value="PERFUME">Perfume</option>
            <option value="ATTAR">Attar</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 md:flex-none border border-foreground/10 bg-background px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:border-gold transition-colors text-foreground/80 focus:outline-none focus:border-gold">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
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
                    <input 
                      type="checkbox" 
                      className="accent-gold w-4 h-4 rounded border-foreground/30 cursor-pointer" 
                      checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.includes(p.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Category / Type</th>
                  <th className="p-4 font-bold">Price (Base)</th>
                  <th className="p-4 font-bold">Stock</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-foreground/50 text-sm">
                      No products found. Add a product to get started!
                    </td>
                  </tr>
                ) : filteredProducts.map((product) => {
                  const baseVariant = product.variants?.[0] || { price: 0, stock_quantity: 0 };
                  const imageUrl = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop";
                  
                  return (
                    <tr key={product.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm group">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="accent-gold w-4 h-4 rounded border-foreground/30 cursor-pointer" 
                          checked={selectedIds.includes(product.id)}
                          onChange={() => handleSelectOne(product.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-foreground/5 flex-shrink-0">
                            <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                          </div>
                          <span className="font-bold text-foreground tracking-wide">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-foreground/80 font-medium text-sm">{product.category?.name || `Cat #${product.category_id}`}</span>
                          {product.fragrance_type && (
                            <span className="text-[10px] text-gold/70 uppercase tracking-widest font-bold">{product.fragrance_type}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-foreground">Rs. {baseVariant.price}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${baseVariant.stock_quantity > 20 ? 'bg-green-500/10 text-green-500' : 
                            baseVariant.stock_quantity > 0 ? 'bg-yellow-500/10 text-yellow-500' : 
                            'bg-red-500/10 text-red-500'}`}
                        >
                          {baseVariant.stock_quantity > 0 ? `${baseVariant.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingProduct(product)} className="text-foreground/50 hover:text-gold transition-colors p-2 bg-foreground/5 rounded-lg"><Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-foreground/50 hover:text-red-500 transition-colors p-2 bg-foreground/5 rounded-lg disabled:opacity-50"
                            onClick={() => confirmDeleteSingle(product.id)}
                            disabled={isDeleting}
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
      </div>

      {/* Modals */}
      <Modal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} title="Add New Product" maxWidth="max-w-2xl">
  <form className="flex flex-col gap-6" onSubmit={handleAddProduct}>
    {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg text-center">{error}</div>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Product Name</label>
        <input type="text" name="name" placeholder="e.g. Royal Oud" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Category</label>
        <select name="category_id" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
          <option value="">Select category</option>
          <option value="1">Men</option>
          <option value="2">Women</option>
          <option value="3">Unisex</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Product Type</label>
        <select name="fragrance_type" className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
          <option value="">Select type</option>
          <option value="PERFUME">Perfume</option>
          <option value="ATTAR">Attar</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Fragrance Notes</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Top Notes</span>
            <input type="text" name="top_notes" placeholder="e.g. Bergamot, Lemon" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Heart Notes</span>
            <input type="text" name="heart_notes" placeholder="e.g. Rose, Jasmine" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Musk / Amber (Base)</span>
            <input type="text" name="base_notes" placeholder="e.g. Musk, Amber, Oud" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Size Options</label>
        <div className="flex flex-col gap-3">
          {/* 50ml */}
          <div className={`border rounded-lg p-3 transition-colors ${add50 ? 'border-gold/40 bg-gold/5' : 'border-foreground/10'}`}>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={add50} onChange={e => setAdd50(e.target.checked)} className="accent-gold w-4 h-4" />
              <span className="text-sm font-bold tracking-widest uppercase text-foreground">50ml</span>
            </label>
            {add50 && (
              <div className="grid grid-cols-2 gap-3 pl-7">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Price (Rs.)</span>
                  <input type="number" name="price_50" placeholder="1500" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Stock</span>
                  <input type="number" name="stock_50" placeholder="50" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                </div>
              </div>
            )}
          </div>
          {/* 100ml */}
          <div className={`border rounded-lg p-3 transition-colors ${add100 ? 'border-gold/40 bg-gold/5' : 'border-foreground/10'}`}>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={add100} onChange={e => setAdd100(e.target.checked)} className="accent-gold w-4 h-4" />
              <span className="text-sm font-bold tracking-widest uppercase text-foreground">100ml</span>
            </label>
            {add100 && (
              <div className="grid grid-cols-2 gap-3 pl-7">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Price (Rs.)</span>
                  <input type="number" name="price_100" placeholder="2000" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Stock</span>
                  <input type="number" name="stock_100" placeholder="50" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Ingredients</label>
        <textarea name="description" placeholder="e.g. Alcohol Denat., Parfum, Aqua, Limonene, Linalool..." rows={3} className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
      </div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Upload Images (Max 3)</label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 3) {
              alert("You can only upload a maximum of 3 images.");
              e.target.value = "";
            }
          }}
          className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
          required
        />
      </div>
    </div>
    <button type="submit" disabled={saving} className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-gold/90 transition-colors disabled:opacity-50">
      {saving ? "Saving Product..." : "Save Product"}
    </button>
  </form>
</Modal>
      <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title="Edit Product" maxWidth="max-w-2xl">
  {editingProduct && (
    <form key={editingProduct.id} className="flex flex-col gap-6" onSubmit={handleEditProduct}>
      {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Product Name</label>
          <input type="text" name="name" defaultValue={editingProduct.name} className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Category</label>
          <select name="category_id" defaultValue={editingProduct.category_id?.toString()} className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
            <option value="1">Men</option>
            <option value="2">Women</option>
            <option value="3">Unisex</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Product Type</label>
          <select name="fragrance_type" defaultValue={editingProduct.fragrance_type || ''} className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground *:bg-background" required>
            <option value="">Select type</option>
            <option value="PERFUME">Perfume</option>
            <option value="ATTAR">Attar</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Fragrance Notes</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['TOP','HEART','BASE'] as const).map((type, i) => {
              const names = ['top_notes','heart_notes','base_notes'] as const;
              const labels = ['Top Notes','Heart Notes','Musk / Amber (Base)'];
              const placeholders = ['e.g. Bergamot, Lemon','e.g. Rose, Jasmine','e.g. Musk, Amber, Oud'];
              const existing = (editingProduct.fragrance_notes || []).find((n: any) => n.note_type === type);
              return (
                <div key={type} className="flex flex-col gap-1">
                  <span className="text-[10px] text-foreground/40 uppercase tracking-widest">{labels[i]}</span>
                  <input type="text" name={names[i]} defaultValue={existing?.note_name || ''} placeholder={placeholders[i]} className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Size Options</label>
          <div className="flex flex-col gap-3">
            {/* 50ml */}
            {(() => {
              const v50 = (editingProduct.variants || []).find((v: any) => v.size_ml === 50);
              return (
                <div className={`border rounded-lg p-3 transition-colors ${edit50 ? 'border-gold/40 bg-gold/5' : 'border-foreground/10'}`}>
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input type="checkbox" checked={edit50} onChange={e => setEdit50(e.target.checked)} className="accent-gold w-4 h-4" />
                    <span className="text-sm font-bold tracking-widest uppercase text-foreground">50ml</span>
                  </label>
                  {edit50 && (
                    <div className="grid grid-cols-2 gap-3 pl-7">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Price (Rs.)</span>
                        <input type="number" name="price_50" defaultValue={v50?.price || ''} placeholder="1500" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Stock</span>
                        <input type="number" name="stock_50" defaultValue={v50?.stock_quantity || ''} placeholder="50" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            {/* 100ml */}
            {(() => {
              const v100 = (editingProduct.variants || []).find((v: any) => v.size_ml === 100);
              return (
                <div className={`border rounded-lg p-3 transition-colors ${edit100 ? 'border-gold/40 bg-gold/5' : 'border-foreground/10'}`}>
                  <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input type="checkbox" checked={edit100} onChange={e => setEdit100(e.target.checked)} className="accent-gold w-4 h-4" />
                    <span className="text-sm font-bold tracking-widest uppercase text-foreground">100ml</span>
                  </label>
                  {edit100 && (
                    <div className="grid grid-cols-2 gap-3 pl-7">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Price (Rs.)</span>
                        <input type="number" name="price_100" defaultValue={v100?.price || ''} placeholder="2000" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Stock</span>
                        <input type="number" name="stock_100" defaultValue={v100?.stock_quantity || ''} placeholder="50" className="bg-transparent border border-foreground/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none text-foreground" required />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Ingredients</label>
          <textarea name="description" defaultValue={editingProduct.description} rows={3} placeholder="e.g. Alcohol Denat., Parfum, Aqua, Limonene, Linalool..." className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Status</label>
          <select name="is_active" defaultValue={editingProduct.is_active ? "true" : "false"} className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Upload New Images (optional, max 3)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 3) {
                alert("You can only upload a maximum of 3 images.");
                e.target.value = "";
              }
            }}
            className="bg-transparent border border-foreground/20 rounded-lg px-4 py-2 text-sm focus:border-gold outline-none text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
          />
        </div>
      </div>
      <button type="submit" disabled={saving} className="w-full bg-gold text-background font-bold uppercase tracking-widest py-3 rounded-lg text-sm mt-4 hover:bg-gold/90 transition-colors disabled:opacity-50">
        {saving ? "Updating Product..." : "Update Product"}
      </button>
    </form>
  )}
</Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteConfirmation.isOpen} 
        onClose={() => setDeleteConfirmation({ isOpen: false, type: 'single' })} 
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-6">
          <p className="text-foreground/80 text-sm tracking-wide">
            {deleteConfirmation.type === 'bulk' 
              ? `Are you sure you want to permanently delete ${selectedIds.length} selected products?`
              : "Are you sure you want to permanently delete this product?"}
            <br /><br />
            This action cannot be undone. Historical orders will remain intact.
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <button 
              onClick={() => setDeleteConfirmation({ isOpen: false, type: 'single' })}
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest hover:bg-foreground/5 transition-colors uppercase border border-foreground/10 text-foreground/70"
            >
              Cancel
            </button>
            <button 
              onClick={executeDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest bg-red-500 text-white hover:bg-red-600 transition-colors uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
