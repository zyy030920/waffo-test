import { fallbackPlanner, emptyRisk, emptyStyle, plannerMessages, riskMessages, styleMessages, translatorMessages } from "./agents";
import { applyGlossaryDraft, matchTerms } from "./glossary";
import { completeMinimax, extractJsonObject } from "./minimax";
import type {
  PlannerOutput,
  RiskOutput,
  StyleOutput,
  TermMatch,
  TranslatorDraft,
} from "./types";

export type PipelineSettings = {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
};

export type PipelineEmit = (event: string, data: unknown) => void;

async function runModel(
  settings: PipelineSettings,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens?: number,
) {
  return completeMinimax({
    ...settings,
    messages,
    maxTokens,
  });
}

export async function runAgentPipeline(options: {
  source: string;
  domain?: string;
  comparePrompts: boolean;
  glossary: Parameters<typeof matchTerms>[1];
  settings: PipelineSettings | null;
  emit: PipelineEmit;
}) {
  const { source, emit } = options;
  const matches = matchTerms(source, options.glossary, {
    direction: "en-zh",
    domain: options.domain,
  });
  const locked = applyGlossaryDraft(source, matches);

  emit("agent-start", { agent: "terminology" });
  emit("agent-done", {
    agent: "terminology",
    matches,
    locked,
  });

  if (!options.settings) {
    emit("agent-done", { agent: "planner", output: fallbackPlanner(source, matches) });
    emit("done", {
      mode: "preview",
      translation: "",
      message:
        "术语与任务拆解已完成。接上 MiniMax 后，Translator / Style / Risk 才会继续跑。",
    });
    return;
  }

  emit("agent-start", { agent: "planner" });
  const planner = await parsePlanner(
    await runModel(options.settings, plannerMessages(source, matches)),
    source,
    matches,
  );
  emit("agent-done", { agent: "planner", output: planner });

  const variants: TranslatorDraft["variant"][] = options.comparePrompts
    ? ["p1", "p2", "p3"]
    : ["p3"];
  const drafts: TranslatorDraft[] = [];
  emit("agent-start", { agent: "translator" });
  for (const variant of variants) {
    const output = await runModel(
      options.settings,
      translatorMessages(source, matches, variant),
      1024,
    );
    drafts.push({
      variant,
      label:
        variant === "p1" ? "基础指令" : variant === "p2" ? "角色 + 语体" : "R–T–C–A–C 约束",
      output,
    });
  }
  const primary = drafts.find((item) => item.variant === "p3")?.output || drafts[0]?.output || "";
  emit("agent-done", { agent: "translator", drafts, primary });

  emit("agent-start", { agent: "style" });
  const style = await parseStyle(
    await runModel(options.settings, styleMessages(source, primary, matches)),
    primary,
  );
  emit("agent-done", { agent: "style", output: style });

  const candidate = style.revised.trim() || primary;
  emit("agent-start", { agent: "risk" });
  const risk = await parseRisk(
    await runModel(options.settings, riskMessages(source, candidate, matches)),
  );
  emit("agent-done", { agent: "risk", output: risk });

  emit("done", {
    mode: "live",
    translation: candidate,
  });
}

function parsePlanner(raw: string, source: string, matches: TermMatch[]): PlannerOutput {
  try {
    return extractJsonObject<PlannerOutput>(raw);
  } catch {
    return fallbackPlanner(source, matches);
  }
}

function parseStyle(raw: string, draft: string): StyleOutput {
  try {
    const parsed = extractJsonObject<StyleOutput>(raw);
    return {
      register: parsed.register || "正式政策语篇",
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      revised: parsed.revised?.trim() || draft,
    };
  } catch {
    return { ...emptyStyle(draft), revised: draft, issues: ["Style Agent 返回无法解析，已保留 Translator 初稿"] };
  }
}

function parseRisk(raw: string): RiskOutput {
  try {
    const parsed = extractJsonObject<RiskOutput>(raw);
    return {
      findings: Array.isArray(parsed.findings) ? parsed.findings : emptyRisk().findings,
      overall: parsed.overall || "",
    };
  } catch {
    return emptyRisk();
  }
}
