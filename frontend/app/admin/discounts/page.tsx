"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { adminDiscountService, DiscountCode } from "../services/adminDiscountService";

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<DiscountCode>>({
    code: "",
    type: "PERCENTAGE",
    value: "",
    min_order: "0",
    max_uses: null,
    is_active: true,
    expires_at: "",
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const data = await adminDiscountService.getAllDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error("Failed to fetch discounts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDiscount = await adminDiscountService.createDiscount(formData);
      setDiscounts([newDiscount, ...discounts]);
      setIsModalOpen(false);
      setFormData({
        code: "",
        type: "PERCENTAGE",
        value: "",
        min_order: "0",
        max_uses: null,
        is_active: true,
        expires_at: "",
      });
    } catch (error) {
      console.error("Failed to create discount", error);
      alert(error instanceof Error ? error.message : "Failed to create discount");
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await adminDiscountService.updateDiscount(id, { is_active: !currentStatus });
      setDiscounts(discounts.map(d => d.id === id ? { ...d, is_active: !currentStatus } : d));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this discount?")) return;
    try {
      await adminDiscountService.deleteDiscount(id);
      setDiscounts(discounts.filter(d => d.id !== id));
    } catch (error) {
      console.error("Failed to delete discount", error);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-foreground/50">Loading discounts...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-foreground">Discount Codes</h1>
          <p className="text-foreground/60 mt-2">Manage store coupons and promotions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Discount
        </button>
      </div>

      <div className="bg-background/50 border border-foreground/10 rounded-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/5 text-sm uppercase tracking-wider text-foreground/60">
                <th className="p-4 font-semibold">Code</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Value</th>
                <th className="p-4 font-semibold">Usage</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Expiry</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="p-4 font-bold text-foreground">{discount.code}</td>
                  <td className="p-4 text-foreground/80">{discount.type}</td>
                  <td className="p-4 text-foreground/80">
                    {discount.type === 'PERCENTAGE' ? `${discount.value}%` : `Rs. ${discount.value}`}
                  </td>
                  <td className="p-4 text-foreground/80">
                    {discount.used_count} / {discount.max_uses ? discount.max_uses : '∞'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(discount.id, discount.is_active)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${discount.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {discount.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-foreground/80">
                    {discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(discount.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-foreground/50">
                    No discount codes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-foreground/10 rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif mb-6">Create Discount Code</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2 uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PERCENTAGE' | 'FLAT' })}
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Minimum Order Amount (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2"
                  value={formData.min_order}
                  onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Maximum Uses (Total)</label>
                <input
                  type="number"
                  placeholder="Leave empty for unlimited"
                  min="1"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2"
                  value={formData.max_uses || ''}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                <input
                  type="datetime-local"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2"
                  value={formData.expires_at || ''}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg font-semibold text-foreground/70 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
