import type { GlossaryTerm, TermMatch, TranslateDirection } from "./types";

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isLatinWordChar(ch: string | undefined) {
  return !!ch && /[A-Za-z0-9_]/.test(ch);
}

function sourceOf(term: GlossaryTerm, direction: TranslateDirection) {
  return direction === "zh-en" ? term.translation : term.term;
}

function targetOf(term: GlossaryTerm, direction: TranslateDirection) {
  return direction === "zh-en" ? term.term : term.translation;
}

export function matchTerms(
  input: string,
  glossary: GlossaryTerm[],
  options: { direction?: TranslateDirection; domain?: string } = {},
): TermMatch[] {
  const direction = options.direction ?? "en-zh";
  const domain = options.domain?.trim();
  const candidates = glossary
    .filter((item) => {
      if (!domain || domain === "全部") return true;
      return item.domain === domain;
    })
    .map((item) => ({
      item,
      source: sourceOf(item, direction).trim(),
      target: targetOf(item, direction).trim(),
    }))
    .filter((entry) => entry.source.length > 0)
    .sort((a, b) => b.source.length - a.source.length);

  const occupied = Array.from({ length: input.length }, () => false);
  const matches: TermMatch[] = [];

  for (const { item, source, target } of candidates) {
    const regex = new RegExp(escapeRegExp(source), "gi");
    let found: RegExpExecArray | null;

    while ((found = regex.exec(input)) !== null) {
      const start = found.index;
      const end = start + found[0].length;
      const usesLatin = /[A-Za-z]/.test(source);

      if (usesLatin) {
        if (isLatinWordChar(input[start - 1])) continue;
        if (isLatinWordChar(input[end])) continue;
      }

      let overlap = false;
      for (let i = start; i < end; i += 1) {
        if (occupied[i]) {
          overlap = true;
          break;
        }
      }
      if (overlap) continue;

      for (let i = start; i < end; i += 1) occupied[i] = true;

      matches.push({
        term: source,
        translation: target,
        matched: found[0],
        start,
        end,
        domain: item.domain,
      });
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

export function applyGlossaryDraft(input: string, matches: TermMatch[]) {
  return [...matches]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, match) =>
        text.slice(0, match.start) + match.translation + text.slice(match.end),
      input,
    );
}

export function formatMatchedTerms(matches: TermMatch[]) {
  if (matches.length === 0) return "（未命中术语）";
  return matches
    .map((match) => `英文/原文: ${match.term}; 译文: ${match.translation}`)
    .join("\n");
}

export function uniqueDomains(glossary: GlossaryTerm[]) {
  return [...new Set(glossary.map((item) => item.domain).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "zh-CN"),
  );
}
