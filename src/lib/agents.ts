import type {
  PlannerOutput,
  RiskOutput,
  StyleOutput,
  TermMatch,
  TranslatorDraft,
} from "./types";
import { formatMatchedTerms } from "./glossary";

export const RISK_CATEGORIES = [
  "术语错误",
  "意义偏移",
  "漏译 / 增译",
  "情态 / 立场错误",
  "语体错误",
  "幻觉 / 来源错误",
] as const;

export function plannerMessages(source: string, matches: TermMatch[]) {
  return [
    {
      role: "system" as const,
      content:
        "你是时政翻译规划助手。只输出一个 JSON 对象，不要 Markdown，不要解释。",
    },
    {
      role: "user" as const,
      content: `对以下中文源文做翻译前分析。术语表已命中：
${formatMatchedTerms(matches)}

输出 JSON：
{
  "source_text": "...",
  "register": "文本类型与语域",
  "key_terms": [{"zh":"...","en_options":["..."],"risk":"high|medium|low — 说明"}],
  "syntactic_features": ["..."],
  "expected_translation_strategy": "...",
  "verification_sources": ["应核验的权威源"]
}

源文：
${source}`,
    },
  ];
}

export function translatorMessages(
  source: string,
  matches: TermMatch[],
  variant: TranslatorDraft["variant"],
) {
  if (variant === "p1") {
    return [
      {
        role: "system" as const,
        content: "你是翻译助手。只输出英文译文，不要解释。",
      },
      {
        role: "user" as const,
        content: `请将以下内容翻译成英文：\n${source}`,
      },
    ];
  }

  if (variant === "p2") {
    return [
      {
        role: "system" as const,
        content:
          "你是一名专业中英时政翻译。只输出适合中国政府官方英文文件的译文，不要解释。",
      },
      {
        role: "user" as const,
        content: `请将以下内容翻译成适合中国政府官方英文文件的英语：\n${source}`,
      },
    ];
  }

  return [
    {
      role: "system" as const,
      content: [
        "【Role】You are a senior Chinese-to-English political translator, familiar with official English versions of China's Government Work Report and State Council policy documents.",
        "【Task】Translate into English suitable for an official Chinese government policy document. Produce ONE primary translation.",
        "【Audience】International readers of Chinese government policy: journalists, researchers, diplomats.",
        "【Constraints】",
        "1. Prioritize established official terminology from the glossary below. If uncertain, mark [VERIFY] after that term — do not invent.",
        "2. Preserve political and policy meaning. Do not soften modality.",
        "3. Do not add explanations not in the source. Do not omit political commitments.",
        "4. Maintain formal, concise register.",
        "5. For Chinese sentences without explicit subjects, supply We + will/must/should consistent with the source stance.",
        "6. Policy names ending in + (人工智能+, 互联网+) are named initiatives: quotation marks, capitalization, append Initiative if appropriate.",
        "只输出英文译文。不要标题。",
      ].join("\n"),
    },
    {
      role: "user" as const,
      content: `术语表（必须遵守）：
${formatMatchedTerms(matches)}

【Source text】
${source}`,
    },
  ];
}

export function styleMessages(source: string, draft: string, matches: TermMatch[]) {
  return [
    {
      role: "system" as const,
      content: "你是时政译文语体校审。只输出 JSON，不要 Markdown。",
    },
    {
      role: "user" as const,
      content: `对照原文审订英译的语域、对仗、主语与情态。术语必须保持：
${formatMatchedTerms(matches)}

原文：
${source}

初稿：
${draft}

输出：
{
  "register": "语域判断",
  "issues": ["具体问题"],
  "revised": "修订后的完整英文译文"
}`,
    },
  ];
}

export function riskMessages(source: string, draft: string, matches: TermMatch[]) {
  return [
    {
      role: "system" as const,
      content: "你是时政翻译风险扫描助手。只输出 JSON，不要 Markdown。",
    },
    {
      role: "user" as const,
      content: `用六类风险扫描译文：1 术语错误 2 意义偏移 3 漏译/增译 4 情态/立场错误 5 语体错误 6 幻觉/来源错误。
已锁定术语：
${formatMatchedTerms(matches)}

原文：
${source}

待审译文：
${draft}

输出：
{
  "findings": [
    {"category":1,"name":"术语错误","severity":"high|medium|low|none","evidence":"...","path":"改进路径"}
  ],
  "overall": "一句话总评"
}
findings 必须正好覆盖 1 到 6 类。`,
    },
  ];
}

export function fallbackPlanner(source: string, matches: TermMatch[]): PlannerOutput {
  return {
    source_text: source,
    register: "待 MiniMax 分析。当前仅根据术语表做了预拆解。",
    key_terms: matches.map((match) => ({
      zh: match.term,
      en_options: [match.translation],
      risk: "medium — 来自本地术语表，尚未做权威源交叉核验",
    })),
    syntactic_features: source.includes("。")
      ? ["并列短句", "可能是无主语句"]
      : ["单句"],
    expected_translation_strategy:
      "先锁术语，再补英文主语与情态，政策对位优先于自然英语。",
    verification_sources: [
      "中国翻译研究院政府工作报告英译本",
      "中国政府网英文版",
      "本地术语表 / 时政域",
    ],
  };
}

export function emptyStyle(draft: string): StyleOutput {
  return {
    register: "未跑 Style Agent",
    issues: ["需要 MiniMax Key 才能做语体校审"],
    revised: draft,
  };
}

export function emptyRisk(): RiskOutput {
  return {
    findings: RISK_CATEGORIES.map((name, index) => ({
      category: index + 1,
      name,
      severity: "none" as const,
      evidence: "预览模式未扫描",
      path: "接上 MiniMax 后由 Risk Agent 扫描",
    })),
    overall: "术语已锁定，完整风险扫描需要 MiniMax。",
  };
}
