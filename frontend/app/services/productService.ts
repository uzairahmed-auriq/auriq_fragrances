const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const productService = {
  async getAllProducts() {
    const res = await fetch(`${API_URL}/products`, {
      next: { tags: ['products'] }
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getFeaturedProducts() {
    const res = await fetch(`${API_URL}/products/featured`, {
      next: { tags: ['products'] }
    });
    if (!res.ok) throw new Error('Failed to fetch featured products');
    return res.json();
  },

  async getBestSellers() {
    const res = await fetch(`${API_URL}/products/bestsellers`, {
      next: { tags: ['products'] }
    });
    if (!res.ok) throw new Error('Failed to fetch best sellers');
    return res.json();
  },

  async getProductById(id: string | number) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { tags: ['products'] }
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  }
};
