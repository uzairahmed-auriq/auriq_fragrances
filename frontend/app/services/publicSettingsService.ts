import { API_URL, fetchWithTimeout } from "../utils/api";

export const publicSettingsService = {
  getSettingsByGroup: async (group?: string) => {
    try {
      const url = group ? `${API_URL}/public/settings?group=${group}` : `${API_URL}/public/settings`;
      const res = await fetchWithTimeout(url, {
        next: { revalidate: 3600 }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.warn("Failed to fetch public settings:", error instanceof Error ? error.message : String(error));
      return {};
    }
  }
};
