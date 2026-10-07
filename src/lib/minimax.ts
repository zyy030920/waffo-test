import { isMinimaxEndpoint, normalizeChatBaseUrl } from "./providers";
import { stripModelNoise } from "./prompts";

export function normalizeBaseUrl(url: string) {
  return normalizeChatBaseUrl(url);
}

function chatBody(options: {
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  maxTokens?: number;
  stream: boolean;
  baseUrl: string;
}) {
  const body: Record<string, unknown> = {
    model: options.model,
    messages: options.messages,
    stream: options.stream,
    temperature: options.temperature ?? 0.2,
  };
  if (isMinimaxEndpoint(options.baseUrl)) {
    body.max_completion_tokens = options.maxTokens ?? 2048;
    body.thinking = { type: "disabled" };
  } else {
    body.max_tokens = options.maxTokens ?? 2048;
  }
  return body;
}

export async function completeChat(options: {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens?: number;
}) {
  const response = await fetch(`${options.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      chatBody({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        stream: false,
        baseUrl: options.baseUrl,
      }),
    ),
  });

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    base_resp?: { status_code?: number; status_msg?: string };
  };

  if (!response.ok) {
    throw new Error(
      explainMinimaxAuthError(payload, options.baseUrl) ||
        payload.error?.message ||
        payload.base_resp?.status_msg ||
        `模型请求失败（${response.status}）`,
    );
  }

  return stripModelNoise(payload.choices?.[0]?.message?.content ?? "");
}

export const completeMinimax = completeChat;

export function extractJsonObject<T>(text: string): T {
  const cleaned = stripModelNoise(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("模型没有返回可解析的 JSON");
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

export async function createMinimaxStream(options: {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}) {
  const response = await fetch(`${options.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      chatBody({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature,
        maxTokens: 4096,
        stream: true,
        baseUrl: options.baseUrl,
      }),
    ),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(extractMinimaxError(detail, options.baseUrl) || `模型请求失败（${response.status}）`);
  }

  if (!response.body) {
    throw new Error("模型没有返回可读取的数据流");
  }

  return response.body;
}

export async function testMinimaxConnection(options: {
  apiKey: string;
  baseUrl: string;
  model: string;
}) {
  const response = await fetch(`${options.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      chatBody({
        model: options.model,
        messages: [{ role: "user", content: "只回复两个字：就绪" }],
        temperature: 0,
        maxTokens: 32,
        stream: false,
        baseUrl: options.baseUrl,
      }),
    ),
  });

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    base_resp?: { status_code?: number; status_msg?: string };
  };

  if (!response.ok) {
    throw new Error(
      explainMinimaxAuthError(payload, options.baseUrl) ||
        payload.error?.message ||
        payload.base_resp?.status_msg ||
        `连接失败（${response.status}）`,
    );
  }

  return payload.choices?.[0]?.message?.content?.trim() || "连接成功";
}

export function extractMinimaxError(raw: string, baseUrl?: string) {
  try {
    const parsed = JSON.parse(raw) as {
      error?: { message?: string; code?: string | number };
      base_resp?: { status_code?: number; status_msg?: string };
      message?: string;
    };
    return (
      explainMinimaxAuthError(parsed, baseUrl) ||
      parsed.error?.message ||
      parsed.base_resp?.status_msg ||
      parsed.message ||
      raw
    );
  } catch {
    return raw.slice(0, 280);
  }
}

function explainMinimaxAuthError(
  payload: {
    error?: { message?: string; code?: string | number };
    base_resp?: { status_code?: number; status_msg?: string };
  },
  baseUrl?: string,
) {
  const code = payload.base_resp?.status_code ?? payload.error?.code;
  const message = `${payload.error?.message ?? ""} ${payload.base_resp?.status_msg ?? ""}`;
  const invalid = String(code) === "2049" || /invalid\s*api\s*key/i.test(message);
  if (!invalid) return "";

  const usedChina = /minimaxi\.com/i.test(baseUrl ?? "");
  if (usedChina) {
    return "invalid api key (2049)：这枚 Key 打的是国内 api.minimaxi.com。CC Switch 能用的是国际站，请把区域改成「国际」，或把 MINIMAX_BASE_URL 设为 https://api.minimax.io/v1。不要填 /anthropic，那是 Claude 兼容地址。";
  }
  return "invalid api key (2049)：Key 未被当前接口接受。国际 Key 用 https://api.minimax.io/v1，不要用 CC Switch 的 /anthropic 地址。";
}

export async function* iterateSseData(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";

      for (const chunk of chunks) {
        for (const line of chunk.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (!data || data === "[DONE]") return;
          yield data;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function readDeltaContent(data: string) {
  try {
    const parsed = JSON.parse(data) as {
      choices?: { delta?: { content?: string | null } }[];
    };
    return parsed.choices?.[0]?.delta?.content ?? "";
  } catch {
    return "";
  }
}
