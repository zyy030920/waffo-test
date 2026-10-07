import { NextResponse } from "next/server";

import { completeChat, extractJsonObject } from "@/lib/minimax";
import { resolveUserOrHost } from "@/lib/model-access";

type Pair = { source: string; translation: string; reason?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: string;
      domain?: string;
      apiKey?: string;
      provider?: string;
      region?: "cn" | "global" | "custom";
      customBaseUrl?: string;
      model?: string;
    };
    const text = body.text?.trim() ?? "";
    if (!text) return NextResponse.json({ error: "请先上传或粘贴真实文本" }, { status: 400 });

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
            "你是术语识别助手。只从用户上传的真实文本中抽出可能需要进入术语表的专名、机构、产品、稳定专业表达。不要编造文本里没有的词。translation 只能是建议译法，必须标成未审核。只返回 JSON：{\"pairs\":[{\"source\":\"原文连续片段\",\"translation\":\"建议译法\",\"reason\":\"为何可能是术语\"}]}。没有可靠候选时 pairs 为空数组。",
        },
        {
          role: "user",
          content: `业务域：${body.domain?.trim() || "通用"}\n文本：\n${text.slice(0, 12000)}`,
        },
      ],
    });
    const parsed = extractJsonObject<{ pairs?: Pair[] }>(content);
    const pairs = (Array.isArray(parsed.pairs) ? parsed.pairs : []).filter((pair) => {
      const source = pair?.source?.trim() ?? "";
      return source && text.includes(source);
    });
    return NextResponse.json({ pairs });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "术语识别失败" },
      { status: 400 },
    );
  }
}
