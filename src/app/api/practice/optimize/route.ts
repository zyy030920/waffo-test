import { hashPracticeTexts, verifyPracticeGrant } from "@/lib/practice-grant";
import { resolveModelAccess, resolveUserOrHost } from "@/lib/model-access";
import { runPracticeOptimize } from "@/lib/practice";
import type { PracticeAppreciation, PracticePlanner } from "@/lib/types";

function missingField(source: string, reference: string, student: string) {
  if (!source) return "请先输入原文";
  if (!reference) return "请先输入参考译文";
  if (!student) return "请先输入自己的译文";
  return "";
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    source?: string;
    reference?: string;
    student?: string;
    domain?: string;
    grant?: string;
    apiKey?: string;
    provider?: string;
    region?: "cn" | "global" | "custom";
    customBaseUrl?: string;
    model?: string;
    temperature?: number;
    direction?: "zh-en" | "en-zh";
    planner?: PracticePlanner | null;
    appreciation?: PracticeAppreciation | null;
  };

  const source = body.source?.trim() ?? "";
  const reference = body.reference?.trim() ?? "";
  const student = body.student?.trim() ?? "";
  const missing = missingField(source, reference, student);
  if (missing) {
    return Response.json({ error: missing }, { status: 400 });
  }

  const grantOk = verifyPracticeGrant(body.grant, hashPracticeTexts(source, reference, student));
  let access;
  try {
    access = grantOk ? resolveUserOrHost(body) : resolveModelAccess(request, body);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "模型配置无效" },
      { status: 400 },
    );
  }
  if (!access.ok) {
    return Response.json({ error: access.error }, { status: access.status });
  }

  try {
    const result = await runPracticeOptimize({
      source,
      reference,
      student,
      domain: body.domain,
      direction: body.direction,
      planner: body.planner ?? null,
      appreciation: body.appreciation ?? null,
      settings: {
        apiKey: access.apiKey,
        baseUrl: access.baseUrl,
        model: access.model,
        temperature: body.temperature ?? 0.3,
      },
    });
    if (!result.translation) {
      return Response.json({ error: "未能写出优化译文" }, { status: 502 });
    }
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "优化中断" },
      { status: 502 },
    );
  }
}
