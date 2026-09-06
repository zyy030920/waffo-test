"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DEFAULT_CLIENT_SETTINGS,
  loadClientSettings,
  saveClientSettings,
} from "@/lib/client-settings";
import type { ClientModelSettings } from "@/lib/types";

export function SettingsPanel() {
  const [settings, setSettings] = useState<ClientModelSettings>(DEFAULT_CLIENT_SETTINGS);
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setSettings(loadClientSettings());
    fetch("/api/settings")
      .then((res) => res.json())
      .then((payload: { hasEnvKey: boolean }) => setHasEnvKey(payload.hasEnvKey))
      .catch(() => undefined);
  }, []);

  function persist(next: ClientModelSettings) {
    setSettings(next);
    saveClientSettings(next);
  }

  async function testConnection() {
    setTesting(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const payload = (await response.json()) as { error?: string; reply?: string };
      if (!response.ok) throw new Error(payload.error || "连接失败");
      toast.success(payload.reply || "MiniMax 已接通");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "连接失败");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-[0.2em]">MINIMAX</p>
        <h1 className="font-heading text-3xl md:text-4xl">接上你的 MiniMax</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">
          Key 只存在这台浏览器的本地存储里，不会写进仓库。如果环境变量
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">MINIMAX_API_KEY</code>
          已经配好，也可以不填。
        </p>
      </section>

      <Card className="max-w-2xl bg-[color:var(--sheet)]">
        <CardHeader>
          <CardTitle>模型与接口</CardTitle>
          <CardDescription>
            {hasEnvKey
              ? "服务器已经读到环境变量里的 Key。页面上再填的 Key 会优先使用。"
              : "当前没有环境变量 Key。不填的话，翻译页仍能匹配术语，只是不会调用模型。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="apiKey">MiniMax API Key</Label>
            <Input
              id="apiKey"
              type="password"
              autoComplete="off"
              value={settings.apiKey}
              onChange={(event) => persist({ ...settings, apiKey: event.target.value })}
              placeholder="从 platform.minimaxi.com 复制"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>区域</Label>
              <Select
                value={settings.region}
                onValueChange={(value) =>
                  persist({ ...settings, region: value as ClientModelSettings["region"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cn">国内 api.minimaxi.com</SelectItem>
                  <SelectItem value="global">国际 api.minimax.io</SelectItem>
                  <SelectItem value="custom">自定义地址</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">模型</Label>
              <Input
                id="model"
                value={settings.model}
                onChange={(event) => persist({ ...settings, model: event.target.value })}
              />
            </div>
          </div>
          {settings.region === "custom" ? (
            <div className="space-y-1.5">
              <Label htmlFor="customBaseUrl">自定义 Base URL</Label>
              <Input
                id="customBaseUrl"
                value={settings.customBaseUrl}
                onChange={(event) =>
                  persist({ ...settings, customBaseUrl: event.target.value })
                }
                placeholder="https://api.minimaxi.com/v1"
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="temperature">温度 {settings.temperature.toFixed(1)}</Label>
            <input
              id="temperature"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings.temperature}
              onChange={(event) =>
                persist({ ...settings, temperature: Number(event.target.value) })
              }
              className="w-full accent-[var(--seal)]"
            />
          </div>
          <Button onClick={() => void testConnection()} disabled={testing}>
            {testing ? <Loader2 className="animate-spin" /> : null}
            测试连接
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
