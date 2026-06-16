import { adminFetch } from "../lib/adminFetch";

export const adminTestimonialService = {
  getAll: async () => {
    const res = await adminFetch(`/testimonials`);
    return res.data;
  },

  create: async (payload: any) => {
    const res = await adminFetch(`/testimonials`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },

  update: async (id: number, payload: any) => {
    const res = await adminFetch(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },

  delete: async (id: number) => {
    const res = await adminFetch(`/testimonials/${id}`, {
      method: "DELETE",
    });
    return res;
  }
};
