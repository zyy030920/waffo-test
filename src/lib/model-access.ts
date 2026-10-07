import {
  hostMinimaxBaseUrl,
  hostMinimaxModel,
  resolveProviderEndpoint,
} from "./providers";
import { hasUsedTrial, TRIAL_REQUIRED_MESSAGE } from "./trial";

export type ModelAccessBody = {
  apiKey?: string;
  provider?: string;
  region?: "cn" | "global" | "custom";
  customBaseUrl?: string;
  model?: string;
};

function providerFromLegacyRegion(region?: ModelAccessBody["region"]) {
  if (region === "cn") return "minimax-cn";
  if (region === "custom") return "custom";
  return "minimax-global";
}

export function resolveModelAccess(request: Request, body: ModelAccessBody) {
  const userKey = body.apiKey?.trim() || request.headers.get("x-model-key")?.trim() || "";
  if (userKey) {
    const endpoint = resolveProviderEndpoint({
      provider: body.provider || providerFromLegacyRegion(body.region),
      customBaseUrl: body.customBaseUrl,
      model: body.model,
    });
    return { ok: true as const, usedHostKey: false, apiKey: userKey, ...endpoint };
  }

  if (hasUsedTrial(request)) {
    return { ok: false as const, error: TRIAL_REQUIRED_MESSAGE, status: 403 };
  }

  const hostKey = process.env.MINIMAX_API_KEY?.trim();
  if (!hostKey) {
    return {
      ok: false as const,
      error: "站点体验额度未配置。请到设置填写你自己的 API Key。",
      status: 400,
    };
  }

  return {
    ok: true as const,
    usedHostKey: true,
    apiKey: hostKey,
    provider: "minimax-global" as const,
    baseUrl: hostMinimaxBaseUrl(),
    model: hostMinimaxModel(),
  };
}

export function resolveUserOrHost(body: ModelAccessBody) {
  const userKey = body.apiKey?.trim();
  if (userKey) {
    const endpoint = resolveProviderEndpoint({
      provider: body.provider || providerFromLegacyRegion(body.region),
      customBaseUrl: body.customBaseUrl,
      model: body.model,
    });
    return { ok: true as const, usedHostKey: false, apiKey: userKey, ...endpoint };
  }

  const hostKey = process.env.MINIMAX_API_KEY?.trim();
  if (!hostKey) {
    return {
      ok: false as const,
      error: "请到设置填写你自己的 API Key。",
      status: 400,
    };
  }

  return {
    ok: true as const,
    usedHostKey: true,
    apiKey: hostKey,
    provider: "minimax-global" as const,
    baseUrl: hostMinimaxBaseUrl(),
    model: hostMinimaxModel(),
  };
}
