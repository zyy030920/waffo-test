import { NextResponse } from "next/server";

import { completeChat, extractJsonObject } from "@/lib/minimax";
import { resolveUserOrHost } from "@/lib/model-access";

type Pair = { source: string; translation: string; reason?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      source?: string;
      translation?: string;
      domain?: string;
      apiKey?: string;
      provider?: string;
      region?: "cn" | "global" | "custom";
      customBaseUrl?: string;
      model?: string;
    };
    const source = body.source?.trim() ?? "";
    const translation = body.translation?.trim() ?? "";
    if (!source || !translation) {
      return NextResponse.json({ error: "需要原文和译文才能提取术语" }, { status: 400 });
    }

    const access = resolveUserOrHost(body);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const content = await completeChat({
      apiKey: access.apiKey,
      baseUrl: access.baseUrl,
      model: access.model,
      temperature: 0.1,
      maxTokens: 2500,
      messages: [
        {
          role: "system",
          content:
            "你是翻译术语对齐助手。只提取原文和译文中都真实出现、语义一一对应的专名、机构名、政策概念、产品名或稳定专业表达。不要把整句、普通词、解释性增译或无法精确对齐的词列为术语。不得改写原文和译文片段。只返回 JSON：{\"pairs\":[{\"source\":\"原文中连续出现的精确片段\",\"translation\":\"译文中连续出现的精确片段\",\"reason\":\"简短说明\"}]}。没有可靠术语时 pairs 返回空数组。",
        },
        {
          role: "user",
          content: `业务域：${body.domain?.trim() || "通用"}\n原文：\n${source}\n\n译文：\n${translation}`,
        },
      ],
    });
    const parsed = extractJsonObject<{ pairs?: Pair[] }>(content);
    const pairs = (Array.isArray(parsed.pairs) ? parsed.pairs : []).filter(
      (pair) =>
        typeof pair?.source === "string" &&
        typeof pair?.translation === "string" &&
        Boolean(pair.source.trim()) &&
        Boolean(pair.translation.trim()) &&
        source.includes(pair.source.trim()) &&
        translation.includes(pair.translation.trim()),
    );
    return NextResponse.json({ pairs });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "术语提取失败" },
      { status: 400 },
    );
  }
}
