const COOKIE = "duici_trial_used";

export function hasUsedTrial(request: Request) {
  return new RegExp(`(?:^|;\\s*)${COOKIE}=1(?:;|$)`).test(request.headers.get("cookie") ?? "");
}

export function trialUsedCookie() {
  return `${COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`;
}

export const TRIAL_REQUIRED_MESSAGE =
  "免费的一次五 Agent 体验已用完。请到设置填写你自己的 API Key（MiniMax、DeepSeek、智谱，或任意 OpenAI 兼容接口）。";
