import { adminFetch } from '../lib/adminFetch';

export const adminOrderService = {
  getAll: async () => {
    return await adminFetch('/orders');
  },

  updateStatus: async (orderId: string, status: string) => {
    return await adminFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getPendingCount: async (): Promise<number> => {
    const res = await adminFetch('/orders/pending-count');
    return res?.data?.count ?? 0;
  },

  deleteOrder: async (orderId: number) => {
    return await adminFetch(`/orders/${orderId}`, { method: 'DELETE' });
  }
};
