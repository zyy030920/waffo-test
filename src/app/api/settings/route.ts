import { NextResponse } from "next/server";

import { testMinimaxConnection } from "@/lib/minimax";
import { resolveProviderEndpoint } from "@/lib/providers";
import { hasUsedTrial } from "@/lib/trial";

export async function GET(request: Request) {
  return NextResponse.json({
    hasHostKey: Boolean(process.env.MINIMAX_API_KEY?.trim()),
    trialUsed: hasUsedTrial(request),
    trialAvailable: Boolean(process.env.MINIMAX_API_KEY?.trim()) && !hasUsedTrial(request),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      apiKey?: string;
      provider?: string;
      customBaseUrl?: string;
      model?: string;
    };
    const apiKey = body.apiKey?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "请填写你自己的 API Key" }, { status: 400 });
    }

    const endpoint = resolveProviderEndpoint(body);
    const reply = await testMinimaxConnection({
      apiKey,
      baseUrl: endpoint.baseUrl,
      model: endpoint.model,
    });

    return NextResponse.json({ ok: true, reply });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "连接失败" },
      { status: 400 },
    );
  }
}
