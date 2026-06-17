import { adminFetch } from '../lib/adminFetch';

export const adminProductService = {
  getAll: async () => {
    return adminFetch('/products', { method: 'GET' });
  },
  create: async (formData: FormData) => {
    return adminFetch('/products', {
      method: 'POST',
      body: formData,
    });
  },
  update: async (id: number | string, formData: FormData) => {
    return adminFetch(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },
  delete: async (id: number | string) => {
    return adminFetch(`/products/${id}`, {
      method: 'DELETE',
    });
  },
  bulkDelete: async (ids: (number | string)[]) => {
    return adminFetch('/products', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
  }
};
