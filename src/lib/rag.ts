import { readFileSync } from "node:fs";
import path from "node:path";

import type { AgentId } from "./types";

export type RagChunk = {
  id: string;
  agents: AgentId[];
  title: string;
  tags: string[];
  domains: string[];
  source: string;
  text: string;
};

const INDEX = JSON.parse(
  readFileSync(path.join(process.cwd(), "data", "rag", "chunks.json"), "utf8"),
) as RagChunk[];

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/i)
    .filter((token) => token.length >= 2);
}

export function retrieveRag(agent: AgentId, source: string, domain = "通用", limit = 3) {
  const hay = tokenize(`${source} ${domain}`);
  const scored = INDEX.filter((chunk) => chunk.agents.includes(agent))
    .map((chunk) => {
      const bag = tokenize(`${chunk.title} ${chunk.tags.join(" ")} ${chunk.domains.join(" ")} ${chunk.text}`);
      let score = chunk.domains.includes(domain) || chunk.domains.includes("通用") ? 2 : 0;
      for (const token of hay) {
        if (bag.includes(token)) score += token.length > 3 ? 2 : 1;
      }
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id));

  const picked = (scored.length ? scored : INDEX.filter((chunk) => chunk.agents.includes(agent)).map((chunk) => ({ chunk, score: 1 })))
    .slice(0, limit)
    .map((item) => item.chunk);

  return picked;
}

export function formatRag(chunksToUse: RagChunk[]) {
  if (!chunksToUse.length) return "";
  return chunksToUse
    .map((chunk) => `- ${chunk.title}：${chunk.text}`)
    .join("\n");
}

export function ragBrief(agent: AgentId, source: string, domain?: string) {
  return formatRag(retrieveRag(agent, source, domain));
}
