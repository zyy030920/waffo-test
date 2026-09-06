export type TranslateDirection = "en-zh" | "zh-en";

export type GlossaryTerm = {
  id: string;
  term: string;
  translation: string;
  domain: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type TermMatch = {
  term: string;
  translation: string;
  matched: string;
  start: number;
  end: number;
  domain: string;
};

export type ClientModelSettings = {
  apiKey: string;
  region: "cn" | "global" | "custom";
  customBaseUrl: string;
  model: string;
  temperature: number;
};

export const DEFAULT_DOMAINS = ["时政", "TEST", "通用", "技术"] as const;

export type AgentId = "planner" | "terminology" | "translator" | "style" | "risk";

export type PlannerOutput = {
  source_text: string;
  register: string;
  key_terms: { zh: string; en_options: string[]; risk: string }[];
  syntactic_features: string[];
  expected_translation_strategy: string;
  verification_sources: string[];
};

export type TranslatorDraft = {
  variant: "p1" | "p2" | "p3";
  label: string;
  output: string;
};

export type StyleOutput = {
  register: string;
  issues: string[];
  revised: string;
};

export type RiskFinding = {
  category: number;
  name: string;
  severity: "high" | "medium" | "low" | "none";
  evidence: string;
  path: string;
};

export type RiskOutput = {
  findings: RiskFinding[];
  overall: string;
};

export const MINIMAX_ENDPOINTS = {
  cn: "https://api.minimaxi.com/v1",
  global: "https://api.minimax.io/v1",
} as const;

export const DEFAULT_MODEL = "MiniMax-M3";
