import { NextResponse } from "next/server";

import { defaultModel, resolveBaseUrl, testMinimaxConnection } from "@/lib/minimax";

export async function GET() {
  return NextResponse.json({
    hasEnvKey: Boolean(process.env.MINIMAX_API_KEY?.trim()),
    defaultModel: defaultModel(),
    defaultRegion: "cn",
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      apiKey?: string;
      region?: "cn" | "global" | "custom";
      customBaseUrl?: string;
      model?: string;
    };
    const apiKey = body.apiKey?.trim() || process.env.MINIMAX_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "请先填写 MiniMax API Key" }, { status: 400 });
    }

    const reply = await testMinimaxConnection({
      apiKey,
      baseUrl: resolveBaseUrl(body.region ?? "cn", body.customBaseUrl),
      model: body.model?.trim() || defaultModel(),
    });

    return NextResponse.json({ ok: true, reply });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "连接失败" },
      { status: 400 },
    );
  }
}
