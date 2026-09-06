import { resolveApiKey, resolveBaseUrl, defaultModel } from "@/lib/minimax";
import { readGlossary } from "@/lib/glossary-store";
import { runAgentPipeline } from "@/lib/pipeline";

function encodeEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    text?: string;
    domain?: string;
    comparePrompts?: boolean;
    apiKey?: string;
    region?: "cn" | "global" | "custom";
    customBaseUrl?: string;
    model?: string;
    temperature?: number;
  };

  const source = body.text?.trim() ?? "";
  if (!source) {
    return Response.json({ error: "请先输入中文原文" }, { status: 400 });
  }

  const apiKey = resolveApiKey(body.apiKey ?? request.headers.get("x-minimax-key"));
  const glossary = await readGlossary();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(encodeEvent(event, data)));
      };

      try {
        await runAgentPipeline({
          source,
          domain: body.domain,
          comparePrompts: Boolean(body.comparePrompts),
          glossary,
          settings: apiKey
            ? {
                apiKey,
                baseUrl: resolveBaseUrl(body.region ?? "cn", body.customBaseUrl),
                model: body.model?.trim() || defaultModel(),
                temperature: body.temperature ?? 0.2,
              }
            : null,
          emit,
        });
        controller.close();
      } catch (error) {
        emit("error", {
          message: error instanceof Error ? error.message : "流水线中断",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
