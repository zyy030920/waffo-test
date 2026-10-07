export type ProviderId = "minimax-global" | "minimax-cn" | "deepseek" | "zhipu" | "qwen" | "custom";

export type ProviderPreset = {
  id: ProviderId;
  label: string;
  baseUrl: string;
  model: string;
  keyHint: string;
};

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: "minimax-global",
    label: "MiniMax 国际",
    baseUrl: "https://api.minimax.io/v1",
    model: "MiniMax-M3",
    keyHint: "sk-cp- 开头的国际站 Key",
  },
  {
    id: "minimax-cn",
    label: "MiniMax 国内",
    baseUrl: "https://api.minimaxi.com/v1",
    model: "MiniMax-M3",
    keyHint: "sk-cp- 开头的国内站 Key",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
    keyHint: "sk- 开头的 DeepSeek Key",
  },
  {
    id: "zhipu",
    label: "智谱 GLM",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    keyHint: "智谱开放平台 API Key",
  },
  {
    id: "qwen",
    label: "通义千问",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    keyHint: "阿里云 DashScope API Key",
  },
  {
    id: "custom",
    label: "自定义（OpenAI 兼容）",
    baseUrl: "",
    model: "",
    keyHint: "任意 OpenAI 兼容接口的 Key",
  },
];

export function getProvider(id?: string | null) {
  return PROVIDER_PRESETS.find((item) => item.id === id) ?? PROVIDER_PRESETS[0];
}

export function normalizeChatBaseUrl(url: string) {
  let next = url.trim().replace(/\/+$/, "");
  next = next.replace(/\/anthropic$/i, "/v1");
  next = next.replace(/\/chat\/completions$/i, "");
  if (/^https?:\/\/api\.minimax\.io$/i.test(next)) next = `${next}/v1`;
  if (/^https?:\/\/api\.minimaxi\.com$/i.test(next)) next = `${next}/v1`;
  if (/^https?:\/\/api\.deepseek\.com\/v1$/i.test(next)) next = "https://api.deepseek.com";
  return next;
}

export function isMinimaxEndpoint(url: string) {
  return /minimax/i.test(url);
}

export function hostMinimaxBaseUrl() {
  const fromEnv = process.env.MINIMAX_BASE_URL?.trim();
  if (fromEnv) return normalizeChatBaseUrl(fromEnv);
  return "https://api.minimax.io/v1";
}

export function hostMinimaxModel() {
  return process.env.MINIMAX_MODEL?.trim() || "MiniMax-M3";
}

export function resolveProviderEndpoint(options: {
  provider?: string;
  customBaseUrl?: string;
  model?: string;
}) {
  const preset = getProvider(options.provider);
  const baseUrl = normalizeChatBaseUrl(options.customBaseUrl || preset.baseUrl);
  const model = options.model?.trim() || preset.model || hostMinimaxModel();
  if (!baseUrl) {
    throw new Error("请填写模型接口地址");
  }
  return { provider: preset.id, baseUrl, model };
}
