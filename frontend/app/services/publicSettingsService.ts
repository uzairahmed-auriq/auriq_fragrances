import { API_URL } from "../utils/api";

export const publicSettingsService = {
  getSettingsByGroup: async (group?: string) => {
    try {
      const url = group ? `${API_URL}/public/settings?group=${group}` : `${API_URL}/public/settings`;
      const res = await fetch(url, {
        next: { revalidate: 60 } // Cache for 60 seconds (App Router feature)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data; // Record<string, string>
    } catch (error) {
      console.error("Failed to fetch public settings:", error);
      return {};
    }
  }
};
