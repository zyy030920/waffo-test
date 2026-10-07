export type LastPair = {
  source: string;
  translation: string;
  domain: string;
};

const KEY = "heyi.lastPair";

export function loadLastPair(): LastPair | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "null") as LastPair | null;
    if (!parsed?.source?.trim() || !parsed?.translation?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLastPair(pair: LastPair) {
  window.localStorage.setItem(KEY, JSON.stringify(pair));
}
