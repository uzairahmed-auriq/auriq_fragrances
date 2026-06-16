import { adminFetch } from "../lib/adminFetch";

export const adminAdService = {
  getAds: async () => {
    const res = await adminFetch(`/ads`);
    return res.data;
  },

  createAd: async (formData: FormData) => {
    const res = await adminFetch(`/ads`, {
      method: "POST",
      body: formData,
    });
    return res;
  },

  updateAdStatus: async (id: number, isActive: boolean) => {
    const res = await adminFetch(`/ads/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ is_active: isActive }),
    });
    return res.data;
  },

  deleteAd: async (id: number) => {
    const res = await adminFetch(`/ads/${id}`, {
      method: "DELETE",
    });
    return res;
  }
};
