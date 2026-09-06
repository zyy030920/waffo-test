"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { loadClientSettings } from "@/lib/client-settings";
import { DEMO_EXAMPLES } from "@/lib/examples";
import type { TermMatch, TranslateDirection } from "@/lib/types";
import { uniqueDomains } from "@/lib/glossary";
import type { GlossaryTerm } from "@/lib/types";

type TranslateMeta = {
  matches: TermMatch[];
  draft: string;
  mode: "live" | "preview";
  prompt?: string;
};

async function readSse(
  response: Response,
  onEvent: (event: string, data: unknown) => void,
) {
  if (!response.body) throw new Error("服务器没有返回数据流");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      let event = "message";
      let data = "";
      for (const line of part.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;
      onEvent(event, JSON.parse(data));
    }
  }
}

export function TranslatorWorkspace({ initialText = "" }: { initialText?: string }) {
  const [text, setText] = useState(initialText);
  const [direction, setDirection] = useState<TranslateDirection>("en-zh");
  const [domain, setDomain] = useState("全部");
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<"idle" | "match" | "model" | "done">("idle");
  const [meta, setMeta] = useState<TranslateMeta | null>(null);
  const [translation, setTranslation] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/glossary")
      .then((res) => res.json())
      .then((payload: { terms: GlossaryTerm[] }) => setTerms(payload.terms))
      .catch(() => toast.error("术语表加载失败"));
  }, []);

  const domains = useMemo(() => ["全部", ...uniqueDomains(terms)], [terms]);

  async function translate() {
    if (!text.trim()) {
      toast.error("先贴一段要翻译的原文");
      return;
    }

    const settings = loadClientSettings();
    setBusy(true);
    setStage("match");
    setTranslation("");
    setNotice("");
    setMeta(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          direction,
          domain,
          apiKey: settings.apiKey,
          region: settings.region,
          customBaseUrl: settings.customBaseUrl,
          model: settings.model,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok && !response.headers.get("content-type")?.includes("text/event-stream")) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "翻译请求失败");
      }

      await readSse(response, (event, data) => {
        if (event === "meta") {
          const next = data as TranslateMeta;
          setMeta(next);
          setStage(next.mode === "preview" ? "done" : "model");
        }
        if (event === "delta") {
          setTranslation((data as { text: string }).text);
        }
        if (event === "done") {
          const done = data as { translation?: string; message?: string };
          if (done.translation) setTranslation(done.translation);
          if (done.message) setNotice(done.message);
          setStage("done");
        }
        if (event === "error") {
          throw new Error((data as { message: string }).message);
        }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "翻译失败");
      setStage("idle");
    } finally {
      setBusy(false);
    }
  }

  async function copyResult() {
    const value = translation || meta?.draft || "";
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("已复制译文");
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-[0.2em]">PERSONAL GLOSSARY TRANSLATOR</p>
        <h1 className="font-heading text-3xl leading-tight md:text-4xl">
          先锁术语，再交给 MiniMax 翻译其余部分
        </h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">
          按 Alfred Zhao 那篇教材的思路：术语表先匹配、最长词优先，大模型只负责把剩下的句子写顺。
          这里用 MiniMax 替换 DeepSeek，用本地术语表替换 Oracle。
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {DEMO_EXAMPLES.map((example) => (
          <Button
            key={example.title}
            variant="outline"
            onClick={() => {
              setText(example.text);
              setDirection("en-zh");
              setDomain("TEST");
            }}
          >
            {example.title}
          </Button>
        ))}
      </div>

      <WorkflowSteps stage={stage} preview={meta?.mode === "preview"} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-[color:var(--sheet)]">
          <CardHeader>
            <CardTitle>原文</CardTitle>
            <CardDescription>支持英文到中文，也可以反过来。术语按当前业务域过滤。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>方向</Label>
                <Select
                  value={direction}
                  onValueChange={(value) => setDirection(value as TranslateDirection)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-zh">英文 → 中文</SelectItem>
                    <SelectItem value="zh-en">中文 → 英文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>业务域</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  void translate();
                }
              }}
              placeholder="例如：Oracle Exadata Database Machine is powerful."
              className="min-h-48 resize-y bg-background text-base leading-7"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">⌘ / Ctrl + Enter 开始翻译</p>
              <Button onClick={() => void translate()} disabled={busy} size="lg">
                {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {busy ? "翻译中" : "开始翻译"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[color:var(--sheet)]">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>译文</CardTitle>
                <CardDescription>
                  {meta?.mode === "preview"
                    ? "预览模式：只完成术语锁定，完整句子需要 MiniMax Key。"
                    : "MiniMax 会在术语约束下把整句写顺。"}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => void copyResult()}>
                <Copy />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {notice ? (
              <div className="rounded-xl border border-dashed border-[color:var(--seal)]/30 bg-[color:var(--seal-soft)] px-3 py-2 text-sm leading-6">
                {notice}
              </div>
            ) : null}

            {translation || meta?.draft ? (
              <div className="min-h-48 rounded-xl bg-background px-4 py-3 text-base leading-8 whitespace-pre-wrap">
                {translation || (
                  <span className="text-muted-foreground">
                    术语锁定稿：{meta?.draft}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground flex min-h-48 items-center justify-center rounded-xl border border-dashed bg-background px-4 text-sm leading-7">
                译文会出现在这里。没有 Key 时，也会先告诉你命中了哪些术语。
              </div>
            )}

            {meta && !translation && meta.draft ? (
              <p className="text-muted-foreground text-xs leading-6">
                术语锁定稿还不是最终译文，只是把专有名词先换进去，方便核对。
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>命中术语</CardTitle>
          <CardDescription>
            匹配规则和教材里的 Oracle 函数一样：词边界 + 最长术语优先，避免
            Oracle Database Appliance 被拆成 Oracle。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meta?.matches.length ? (
            <div className="flex flex-wrap gap-2">
              {meta.matches.map((match) => (
                <Badge key={`${match.start}-${match.term}`} variant="secondary" className="h-auto gap-2 py-1">
                  <span>{match.matched}</span>
                  <ArrowRightLeft className="size-3" />
                  <span className="text-[color:var(--seal)]">{match.translation}</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              还没有匹配结果。先跑一次翻译，或到术语表里补上你的私域词汇。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WorkflowSteps({
  stage,
  preview,
}: {
  stage: "idle" | "match" | "model" | "done";
  preview?: boolean;
}) {
  const steps = [
    { id: "match", label: "术语匹配" },
    { id: "model", label: preview ? "等待 MiniMax" : "MiniMax 翻译" },
    { id: "done", label: "输出译文" },
  ] as const;

  const order = { idle: 0, match: 1, model: 2, done: 3 };

  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => {
        const active = order[stage] >= index + 1;
        return (
          <li
            key={step.id}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              active
                ? "border-[color:var(--seal)]/30 bg-[color:var(--seal-soft)]"
                : "bg-[color:var(--sheet)]"
            }`}
          >
            <p className="text-muted-foreground text-xs">0{index + 1}</p>
            <p className="mt-1 font-medium">{step.label}</p>
          </li>
        );
      })}
    </ol>
  );
}
