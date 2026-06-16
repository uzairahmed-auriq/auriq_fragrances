import { adminFetch } from "../lib/adminFetch";

export const adminSettingsService = {
  getSettingsByGroup: async (group?: string) => {
    const endpoint = group ? `/cms/settings?group=${group}` : `/cms/settings`;
    const res = await adminFetch(endpoint);
    return res.data; // Record<string, string>
  },

  updateSettings: async (settings: Record<string, any>, group?: string) => {
    const res = await adminFetch(`/cms/settings`, {
      method: "PUT",
      body: JSON.stringify({ settings, group }),
    });
    return res;
  }
};
