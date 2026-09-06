"use client";

import { useMemo, useState } from "react";
import { Copy, Loader2, PenLine, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { RISK_CATEGORIES } from "@/lib/agents";
import { loadClientSettings } from "@/lib/client-settings";
import { POLITICAL_EXAMPLES } from "@/lib/examples";
import { uniqueDomains } from "@/lib/glossary";
import type {
  AgentId,
  GlossaryTerm,
  PlannerOutput,
  RiskOutput,
  StyleOutput,
  TermMatch,
  TranslatorDraft,
} from "@/lib/types";

type AgentStatus = "idle" | "running" | "done";

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
      if (data) onEvent(event, JSON.parse(data));
    }
  }
}

const AGENT_META: { id: AgentId; title: string; duty: string }[] = [
  { id: "planner", title: "Planner", duty: "拆任务 · 列风险" },
  { id: "terminology", title: "Terminology", duty: "术语锁定 · 权威对位" },
  { id: "translator", title: "Translator", duty: "按约束生成初稿" },
  { id: "style", title: "Style", duty: "语域 · 对仗 · 情态" },
  { id: "risk", title: "Risk", duty: "六类风险扫描" },
];

export function AgentWorkshop({
  initialText = "",
  initialTerms,
}: {
  initialText?: string;
  initialTerms: GlossaryTerm[];
}) {
  const [text, setText] = useState(initialText);
  const [domain, setDomain] = useState("时政");
  const [comparePrompts, setComparePrompts] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Record<AgentId, AgentStatus>>({
    planner: "idle",
    terminology: "idle",
    translator: "idle",
    style: "idle",
    risk: "idle",
  });
  const [matches, setMatches] = useState<TermMatch[]>([]);
  const [planner, setPlanner] = useState<PlannerOutput | null>(null);
  const [drafts, setDrafts] = useState<TranslatorDraft[]>([]);
  const [style, setStyle] = useState<StyleOutput | null>(null);
  const [risk, setRisk] = useState<RiskOutput | null>(null);
  const [delivery, setDelivery] = useState("");
  const [signed, setSigned] = useState(false);
  const [notice, setNotice] = useState("");

  const domains = useMemo(
    () => ["时政", "全部", ...uniqueDomains(initialTerms).filter((item) => item !== "时政")],
    [initialTerms],
  );

  function resetBoard() {
    setStatus({
      planner: "idle",
      terminology: "idle",
      translator: "idle",
      style: "idle",
      risk: "idle",
    });
    setMatches([]);
    setPlanner(null);
    setDrafts([]);
    setStyle(null);
    setRisk(null);
    setDelivery("");
    setSigned(false);
    setNotice("");
  }

  async function run() {
    if (!text.trim()) {
      toast.error("先贴一段中文时政原文");
      return;
    }
    const settings = loadClientSettings();
    resetBoard();
    setBusy(true);

    try {
      const response = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          domain,
          comparePrompts,
          apiKey: settings.apiKey,
          region: settings.region,
          customBaseUrl: settings.customBaseUrl,
          model: settings.model,
          temperature: 0.2,
        }),
      });

      if (!response.ok && !response.headers.get("content-type")?.includes("text/event-stream")) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "流水线请求失败");
      }

      await readSse(response, (event, data) => {
        if (event === "agent-start") {
          const agent = (data as { agent: AgentId }).agent;
          setStatus((prev) => ({ ...prev, [agent]: "running" }));
        }
        if (event === "agent-done") {
          const payload = data as {
            agent: AgentId;
            matches?: TermMatch[];
            output?: unknown;
            drafts?: TranslatorDraft[];
            primary?: string;
          };
          setStatus((prev) => ({ ...prev, [payload.agent]: "done" }));
          if (payload.agent === "terminology") setMatches(payload.matches ?? []);
          if (payload.agent === "planner") setPlanner(payload.output as PlannerOutput);
          if (payload.agent === "translator") {
            setDrafts(payload.drafts ?? []);
            if (payload.primary) setDelivery(payload.primary);
          }
          if (payload.agent === "style") {
            const next = payload.output as StyleOutput;
            setStyle(next);
            if (next.revised) setDelivery(next.revised);
          }
          if (payload.agent === "risk") setRisk(payload.output as RiskOutput);
        }
        if (event === "done") {
          const done = data as { translation?: string; message?: string };
          if (done.translation) setDelivery(done.translation);
          if (done.message) setNotice(done.message);
        }
        if (event === "error") {
          throw new Error((data as { message: string }).message);
        }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "流水线中断");
    } finally {
      setBusy(false);
    }
  }

  async function copyDelivery() {
    if (!delivery) return;
    await navigator.clipboard.writeText(delivery);
    toast.success("已复制定稿");
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-[0.2em]">
          FIVE AGENTS · HUMAN SIGN-OFF
        </p>
        <h1 className="font-heading text-3xl leading-tight md:text-4xl">
          时政翻译多 Agent 工坊
        </h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">
          Planner 拆风险，Terminology 锁术语，Translator 按 R–T–C–A–C 出初稿，Style
          校语域，Risk 扫六类风险。最后由你签发——AI 生成，译者决定。
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {POLITICAL_EXAMPLES.map((example) => (
          <Button
            key={example.title}
            variant="outline"
            onClick={() => {
              setText(example.text);
              setDomain("时政");
            }}
          >
            {example.title}
          </Button>
        ))}
      </div>

      <ol className="grid gap-2 sm:grid-cols-5">
        {AGENT_META.map((agent, index) => {
          const state = status[agent.id];
          return (
            <li
              key={agent.id}
              className={`rounded-2xl border px-3 py-3 text-sm ${
                state === "running"
                  ? "border-[color:var(--seal)]/40 bg-[color:var(--seal-soft)]"
                  : state === "done"
                    ? "border-[color:var(--seal)]/20 bg-[color:var(--sheet)]"
                    : "bg-[color:var(--sheet)]"
              }`}
            >
              <p className="text-muted-foreground text-xs">0{index + 1}</p>
              <p className="mt-1 font-medium">{agent.title}</p>
              <p className="text-muted-foreground mt-1 text-xs">{agent.duty}</p>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-[color:var(--sheet)]">
          <CardHeader>
            <CardTitle>原文</CardTitle>
            <CardDescription>默认中译英。业务域先用「时政」，术语表按最长词锁定。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
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
              <label className="flex items-end gap-2 pb-1 text-sm">
                <input
                  type="checkbox"
                  checked={comparePrompts}
                  onChange={(event) => setComparePrompts(event.target.checked)}
                  className="accent-[var(--seal)]"
                />
                三 Prompt 对比（更慢）
              </label>
            </div>
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder='例如：打造智能经济新形态。深化拓展“人工智能+”。'
              className="min-h-40 bg-background text-base leading-7"
            />
            <div className="flex justify-end">
              <Button onClick={() => void run()} disabled={busy} size="lg">
                {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {busy ? "五 Agent 运行中" : "启动五 Agent"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[color:var(--sheet)]">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>人工总签</CardTitle>
                <CardDescription>可以改，签了才算交付。责任在译者。</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => void copyDelivery()}>
                <Copy />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notice ? (
              <div className="rounded-xl border border-dashed border-[color:var(--seal)]/30 bg-[color:var(--seal-soft)] px-3 py-2 text-sm leading-6">
                {notice}
              </div>
            ) : null}
            <Textarea
              value={delivery}
              onChange={(event) => {
                setDelivery(event.target.value);
                setSigned(false);
              }}
              placeholder="Style 修订稿会出现在这里，你可以直接改。"
              className="min-h-40 bg-background text-base leading-7"
            />
            <Button
              variant={signed ? "secondary" : "default"}
              disabled={!delivery}
              onClick={() => {
                setSigned(true);
                toast.success("已签发。过程档案仍留在本页。");
              }}
            >
              <PenLine />
              {signed ? "已签发" : "译者签发"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Planner · 风险清单</CardTitle>
            <CardDescription>动笔前先写清「我担心什么」。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7">
            {planner ? (
              <>
                <p>
                  <span className="text-muted-foreground">语域　</span>
                  {planner.register}
                </p>
                <p>
                  <span className="text-muted-foreground">策略　</span>
                  {planner.expected_translation_strategy}
                </p>
                <div className="flex flex-wrap gap-2">
                  {planner.key_terms.map((term) => (
                    <Badge key={term.zh} variant="secondary" className="h-auto py-1">
                      {term.zh}
                    </Badge>
                  ))}
                </div>
                {planner.verification_sources?.length ? (
                  <ul className="text-muted-foreground list-disc pl-4">
                    {planner.verification_sources.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <p className="text-muted-foreground">尚未拆解。</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terminology · 命中术语</CardTitle>
            <CardDescription>本地术语表，最长词优先。时政域已预置规范译法。</CardDescription>
          </CardHeader>
          <CardContent>
            {matches.length ? (
              <div className="flex flex-wrap gap-2">
                {matches.map((match) => (
                  <Badge key={`${match.start}-${match.term}`} variant="secondary" className="h-auto gap-2 py-1">
                    <span>{match.matched}</span>
                    <span className="text-[color:var(--seal)]">{match.translation}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">还没有匹配。</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translator · 初稿</CardTitle>
            <CardDescription>
              默认只跑约束版。打开「三 Prompt 对比」会同时跑基础 / 角色 / 约束。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {drafts.length ? (
              drafts.map((draft) => (
                <div key={draft.variant} className="rounded-xl bg-muted/50 px-3 py-2 text-sm leading-7">
                  <p className="text-xs tracking-widest text-[color:var(--seal)]">
                    {draft.variant.toUpperCase()} · {draft.label}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{draft.output}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">等待 Translator。</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style · 语体校审</CardTitle>
            <CardDescription>{style?.register || "尚未校审"}</CardDescription>
          </CardHeader>
          <CardContent>
            {style?.issues.length ? (
              <ul className="list-disc space-y-1 pl-4 text-sm leading-7">
                {style.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">等待 Style Agent。</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk · 六类风险</CardTitle>
          <CardDescription>{risk?.overall || "通顺是底线，政策对位是天花板。"}</CardDescription>
        </CardHeader>
        <CardContent>
          {risk ? (
            <div className="grid gap-3 md:grid-cols-2">
              {risk.findings.map((finding) => (
                <div key={`${finding.category}-${finding.name}`} className="rounded-xl bg-muted/40 px-3 py-3 text-sm leading-6">
                  <p className="font-medium">
                    {finding.category}. {finding.name || RISK_CATEGORIES[finding.category - 1]}
                    <span className="text-muted-foreground ml-2 text-xs">{finding.severity}</span>
                  </p>
                  <p className="mt-1">{finding.evidence}</p>
                  {finding.path ? (
                    <p className="text-muted-foreground mt-1 text-xs">路径：{finding.path}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">等待 Risk Agent。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
