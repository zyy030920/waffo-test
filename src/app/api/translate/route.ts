import { applyGlossaryDraft, matchTerms } from "@/lib/glossary";
import { readGlossary } from "@/lib/glossary-store";
import {
  iterateSseData,
  readDeltaContent,
  resolveApiKey,
  resolveBaseUrl,
  createMinimaxStream,
  defaultModel,
} from "@/lib/minimax";
import { buildTranslationMessages, stripModelNoise } from "@/lib/prompts";
import type { TranslateDirection } from "@/lib/types";

function encodeEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    text?: string;
    direction?: TranslateDirection;
    domain?: string;
    apiKey?: string;
    region?: "cn" | "global" | "custom";
    customBaseUrl?: string;
    model?: string;
    temperature?: number;
  };

  const text = body.text?.trim() ?? "";
  if (!text) {
    return Response.json({ error: "请先输入要翻译的文本" }, { status: 400 });
  }

  const direction = body.direction ?? "en-zh";
  const glossary = await readGlossary();
  const matches = matchTerms(text, glossary, {
    direction,
    domain: body.domain,
  });
  const draft = applyGlossaryDraft(text, matches);
  const messages = buildTranslationMessages(text, matches, direction);
  const apiKey = resolveApiKey(body.apiKey ?? request.headers.get("x-minimax-key"));
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(encodeEvent(event, data)));
      };

      try {
        send("meta", {
          matches,
          draft,
          mode: apiKey ? "live" : "preview",
          prompt: messages[1]?.content,
        });

        if (!apiKey) {
          send("done", {
            translation: "",
            mode: "preview",
            message:
              "还没有 MiniMax API Key。术语已经匹配完成，可在设置里粘贴 Key，或配置环境变量 MINIMAX_API_KEY。",
          });
          controller.close();
          return;
        }

        const baseUrl = resolveBaseUrl(body.region ?? "cn", body.customBaseUrl);
        const upstream = await createMinimaxStream({
          apiKey,
          baseUrl,
          model: body.model?.trim() || defaultModel(),
          temperature: body.temperature ?? 0.3,
          messages,
        });

        let translation = "";
        for await (const data of iterateSseData(upstream)) {
          const delta = readDeltaContent(data);
          if (!delta) continue;
          translation += delta;
          send("delta", { text: stripModelNoise(translation) });
        }

        send("done", {
          translation: stripModelNoise(translation),
          mode: "live",
        });
        controller.close();
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "翻译失败",
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
