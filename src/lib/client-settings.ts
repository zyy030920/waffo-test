import { useSyncExternalStore } from "react";

import { getProvider, type ProviderId } from "./providers";
import type { ClientModelSettings } from "./types";

export const SETTINGS_KEY = "duici.minimax.settings";

export const DEFAULT_CLIENT_SETTINGS: ClientModelSettings = {
  apiKey: "",
  provider: "minimax-global",
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
    const parsed = JSON.parse(raw) as Partial<ClientModelSettings> & {
      region?: "cn" | "global" | "custom";
    };
    let provider = parsed.provider;
    if (!provider) {
      if (parsed.region === "cn") provider = "minimax-cn";
      else if (parsed.region === "custom") provider = "custom";
      else provider = "minimax-global";
    }
    return { ...DEFAULT_CLIENT_SETTINGS, ...parsed, provider };
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

export function settingsPayload(settings: ClientModelSettings) {
  const preset = getProvider(settings.provider);
  return {
    apiKey: settings.apiKey,
    provider: settings.provider,
    customBaseUrl: settings.provider === "custom" ? settings.customBaseUrl : preset.baseUrl,
    model: settings.model || preset.model,
  };
}

export function applyProviderDefaults(
  settings: ClientModelSettings,
  provider: ProviderId,
): ClientModelSettings {
  const preset = getProvider(provider);
  return {
    ...settings,
    provider,
    model: preset.model || settings.model,
    customBaseUrl: provider === "custom" ? settings.customBaseUrl : preset.baseUrl,
  };
}
