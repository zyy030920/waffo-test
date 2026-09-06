import { stripModelNoise } from "./prompts";
import { MINIMAX_ENDPOINTS } from "./types";

export function resolveBaseUrl(region: "cn" | "global" | "custom", customBaseUrl?: string) {
  if (region === "custom") {
    const url = customBaseUrl?.trim().replace(/\/$/, "");
    if (!url) throw new Error("自定义接口地址不能为空");
    return url;
  }
  return MINIMAX_ENDPOINTS[region];
}

export function resolveApiKey(headerKey?: string | null) {
  return headerKey?.trim() || process.env.MINIMAX_API_KEY?.trim() || "";
}

export function defaultModel() {
  return process.env.MINIMAX_MODEL?.trim() || "MiniMax-M3";
}

export async function completeMinimax(options: {
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
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      stream: false,
      temperature: options.temperature,
      max_completion_tokens: options.maxTokens ?? 2048,
      thinking: { type: "disabled" },
    }),
  });

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    base_resp?: { status_code?: number; status_msg?: string };
  };

  if (!response.ok) {
    throw new Error(
      payload.error?.message ||
        payload.base_resp?.status_msg ||
        `MiniMax 请求失败（${response.status}）`,
    );
  }

  return stripModelNoise(payload.choices?.[0]?.message?.content ?? "");
}

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
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      stream: true,
      temperature: options.temperature,
      max_completion_tokens: 4096,
      thinking: { type: "disabled" },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(extractMinimaxError(detail) || `MiniMax 请求失败（${response.status}）`);
  }

  if (!response.body) {
    throw new Error("MiniMax 没有返回可读取的数据流");
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
    body: JSON.stringify({
      model: options.model,
      messages: [
        {
          role: "user",
          content: "只回复两个字：就绪",
        },
      ],
      stream: false,
      max_completion_tokens: 32,
      thinking: { type: "disabled" },
    }),
  });

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    base_resp?: { status_code?: number; status_msg?: string };
  };

  if (!response.ok) {
    throw new Error(
      payload.error?.message ||
        payload.base_resp?.status_msg ||
        `连接失败（${response.status}）`,
    );
  }

  return payload.choices?.[0]?.message?.content?.trim() || "连接成功";
}

export function extractMinimaxError(raw: string) {
  try {
    const parsed = JSON.parse(raw) as {
      error?: { message?: string };
      base_resp?: { status_msg?: string };
      message?: string;
    };
    return parsed.error?.message || parsed.base_resp?.status_msg || parsed.message || raw;
  } catch {
    return raw.slice(0, 280);
  }
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
