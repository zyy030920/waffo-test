import { useSyncExternalStore } from "react";

import type { ClientModelSettings } from "./types";

export const SETTINGS_KEY = "duici.minimax.settings";

export const DEFAULT_CLIENT_SETTINGS: ClientModelSettings = {
  apiKey: "",
  region: "cn",
  customBaseUrl: "",
  model: "MiniMax-M3",
  temperature: 0.3,
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function parseSettings(raw: string | null): ClientModelSettings {
  if (!raw) return DEFAULT_CLIENT_SETTINGS;
  try {
    return { ...DEFAULT_CLIENT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CLIENT_SETTINGS;
  }
}

export function loadClientSettings(): ClientModelSettings {
  if (typeof window === "undefined") return DEFAULT_CLIENT_SETTINGS;
  return parseSettings(window.localStorage.getItem(SETTINGS_KEY));
}

export function saveClientSettings(settings: ClientModelSettings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  emit();
}

export function subscribeClientSettings(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useClientSettings() {
  const raw = useSyncExternalStore(
    subscribeClientSettings,
    () => window.localStorage.getItem(SETTINGS_KEY),
    () => null,
  );
  return parseSettings(raw);
}
