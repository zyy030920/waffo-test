"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { GlossaryTerm } from "@/lib/types";
import { uniqueDomains } from "@/lib/glossary";

type Draft = {
  term: string;
  translation: string;
  domain: string;
  note: string;
};

const EMPTY_DRAFT: Draft = {
  term: "",
  translation: "",
  domain: "TEST",
  note: "",
};

export function GlossaryManager() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("全部");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GlossaryTerm | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const response = await fetch("/api/glossary");
    const payload = (await response.json()) as { terms: GlossaryTerm[] };
    setTerms(payload.terms);
  }

  useEffect(() => {
    refresh().catch(() => toast.error("术语表加载失败"));
  }, []);

  const domains = useMemo(() => ["全部", ...uniqueDomains(terms)], [terms]);
  const visible = terms.filter((item) => {
    const hay = `${item.term} ${item.translation} ${item.note ?? ""}`.toLowerCase();
    const matchedQuery = hay.includes(query.trim().toLowerCase());
    const matchedDomain = domain === "全部" || item.domain === domain;
    return matchedQuery && matchedDomain;
  });

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setOpen(true);
  }

  function openEdit(term: GlossaryTerm) {
    setEditing(term);
    setDraft({
      term: term.term,
      translation: term.translation,
      domain: term.domain,
      note: term.note ?? "",
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      const response = await fetch(
        editing ? `/api/glossary/${editing.id}` : "/api/glossary",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "保存失败");
      toast.success(editing ? "术语已更新" : "术语已加入");
      setOpen(false);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove(term: GlossaryTerm) {
    if (!window.confirm(`删除术语「${term.term}」？`)) return;
    const response = await fetch(`/api/glossary/${term.id}`, { method: "DELETE" });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      toast.error(payload.error || "删除失败");
      return;
    }
    toast.success("已删除");
    await refresh();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(terms, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "glossary.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-[0.2em]">GLOSSARY</p>
        <h1 className="font-heading text-3xl md:text-4xl">你自己的术语表</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">
          教材里这张表放在 Oracle 里，由业务同事维护。这里改成本地 JSON，同样按「业务域 + 术语」唯一。
          先把私域译法写清楚，翻译时就不用每次改提示词。
        </p>
      </section>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索术语或译文"
          className="md:max-w-xs"
        />
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger className="md:w-40">
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
        <div className="flex flex-wrap gap-2 md:ml-auto">
          <Button variant="outline" onClick={exportJson}>
            导出 JSON
          </Button>
          <Button onClick={openCreate}>
            <Plus />
            新增术语
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-muted-foreground rounded-2xl border border-dashed bg-[color:var(--sheet)] px-6 py-16 text-center text-sm">
          没有匹配的术语。换个关键词，或新增一条属于你的译法。
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-[color:var(--sheet)] ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>术语</TableHead>
                <TableHead>指定译文</TableHead>
                <TableHead>业务域</TableHead>
                <TableHead>备注</TableHead>
                <TableHead className="w-28 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((term) => (
                <TableRow key={term.id}>
                  <TableCell className="font-medium">{term.term}</TableCell>
                  <TableCell>{term.translation}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{term.domain}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {term.note || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(term)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => void remove(term)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "编辑术语" : "新增术语"}</DialogTitle>
            <DialogDescription>
              同一业务域里术语必须唯一。建议把最长、最完整的专有名词单独成条。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="term">原文术语</Label>
              <Input
                id="term"
                value={draft.term}
                onChange={(event) => setDraft((prev) => ({ ...prev, term: event.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="translation">指定译文</Label>
              <Input
                id="translation"
                value={draft.translation}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, translation: event.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="domain">业务域</Label>
              <Input
                id="domain"
                value={draft.domain}
                onChange={(event) => setDraft((prev) => ({ ...prev, domain: event.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note">备注</Label>
              <Textarea
                id="note"
                value={draft.note}
                onChange={(event) => setDraft((prev) => ({ ...prev, note: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={() => void save()} disabled={saving}>
              {saving ? "保存中" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
