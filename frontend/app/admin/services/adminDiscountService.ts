import { adminAuthService } from "./adminAuthService";
import { API_URL } from "@/app/utils/api";

export interface DiscountCode {
  id: number;
  code: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: string;
  min_order: string;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export const adminDiscountService = {
  getHeaders() {
    const token = adminAuthService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async getAllDiscounts(): Promise<DiscountCode[]> {
    const response = await fetch(`${API_URL}/admin/discounts`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch discounts');
    const data = await response.json();
    return data.data;
  },

  async createDiscount(discountData: Partial<DiscountCode>): Promise<DiscountCode> {
    const response = await fetch(`${API_URL}/admin/discounts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(discountData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create discount');
    return data.data;
  },

  async updateDiscount(id: number, discountData: Partial<DiscountCode>): Promise<DiscountCode> {
    const response = await fetch(`${API_URL}/admin/discounts/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(discountData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update discount');
    return data.data;
  },

  async deleteDiscount(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/admin/discounts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete discount');
  }
};
