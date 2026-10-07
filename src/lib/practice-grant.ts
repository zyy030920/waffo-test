import { createHash, createHmac } from "node:crypto";

function secret() {
  return process.env.MINIMAX_API_KEY?.trim() || process.env.PRACTICE_GRANT_SECRET?.trim() || "heyi-practice";
}

export function hashPracticeTexts(source: string, reference: string, student: string) {
  return createHash("sha256")
    .update(`${source.trim()}\n---\n${reference.trim()}\n---\n${student.trim()}`)
    .digest("hex")
    .slice(0, 32);
}

export function issuePracticeGrant(hash: string) {
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + 30 * 60 * 1000, hash })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyPracticeGrant(token: string | undefined, hash: string) {
  if (!token?.includes(".")) return false;
  const [body, sig] = token.split(".");
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  if (expected.length !== sig.length || expected !== sig) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as { exp?: number; hash?: string };
    return payload.hash === hash && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
