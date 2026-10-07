import type { TranslateDirection } from "./types";

export function matchDirectionForSource(text: string): TranslateDirection {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  return cjk >= latin ? "zh-en" : "en-zh";
}

export function directionLabel(direction: TranslateDirection, locale: "zh" | "en") {
  if (direction === "zh-en") return locale === "zh" ? "中译英" : "ZH → EN";
  return locale === "zh" ? "英译中" : "EN → ZH";
}

export function sourceLang(direction: TranslateDirection) {
  return direction === "zh-en" ? "Chinese" : "English";
}

export function targetLang(direction: TranslateDirection) {
  return direction === "zh-en" ? "English" : "Chinese";
}
