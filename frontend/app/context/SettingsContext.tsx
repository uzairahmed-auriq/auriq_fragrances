"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { publicSettingsService } from "../services/publicSettingsService";

const SettingsContext = createContext<Record<string, string>>({});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    publicSettingsService.getSettingsByGroup("HOMEPAGE").then(setSettings).catch(console.error);
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
