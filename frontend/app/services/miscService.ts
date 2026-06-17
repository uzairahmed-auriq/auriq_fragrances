const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const miscService = {
  async subscribeNewsletter(email: string) {
    const res = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to subscribe to newsletter');
    return data;
  },

  async getShippingConfig() {
    const res = await fetch(`${API_URL}/shipping-config`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch shipping config');
    return data.data;
  }
};
