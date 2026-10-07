"use client";

import { useEffect, useState } from "react";
import { Loader2, Unplug } from "lucide-react";
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
  applyProviderDefaults,
  loadClientSettings,
  saveClientSettings,
} from "@/lib/client-settings";
import { useLocale } from "@/lib/locale";
import { PROVIDER_PRESETS, getProvider, type ProviderId } from "@/lib/providers";
import type { ClientModelSettings } from "@/lib/types";

export function SettingsPanel() {
  const { t } = useLocale();
  const [settings, setSettings] = useState<ClientModelSettings>(DEFAULT_CLIENT_SETTINGS);
  const [trialAvailable, setTrialAvailable] = useState(false);
  const [trialUsed, setTrialUsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [testing, setTesting] = useState(false);
  const preset = getProvider(settings.provider);

  useEffect(() => {
    setMounted(true);
    setSettings(loadClientSettings());
    fetch("/api/settings")
      .then((res) => res.json())
      .then((payload: { trialAvailable?: boolean; trialUsed?: boolean }) => {
        setTrialAvailable(Boolean(payload.trialAvailable));
        setTrialUsed(Boolean(payload.trialUsed));
      })
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
        body: JSON.stringify({
          apiKey: settings.apiKey,
          provider: settings.provider,
          customBaseUrl: settings.customBaseUrl,
          model: settings.model,
        }),
      });
      const payload = (await response.json()) as { error?: string; reply?: string };
      if (!response.ok) throw new Error(payload.error || t.connectFail);
      toast.success(payload.reply || t.connected);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.connectFail);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-[0.2em]">{t.settingsKicker}</p>
        <h1 className="font-heading text-3xl md:text-4xl">{t.settingsTitle}</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">{t.settingsHint}</p>
      </section>

      <Card className="max-w-2xl rounded-none border-[color:var(--line)] bg-[color:var(--fill-ghost)]">
        <CardHeader>
          <CardTitle>{t.modelCard}</CardTitle>
          <CardDescription>
            {trialAvailable ? t.trialReady : trialUsed ? t.trialGone : t.needKey}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t.provider}</Label>
            {mounted ? (
              <Select
                value={settings.provider}
                onValueChange={(value) =>
                  persist(applyProviderDefaults(settings, value as ProviderId))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t.selectProvider} />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_PRESETS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {t.providers[item.id]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="border-input text-muted-foreground flex h-9 items-center rounded-md border px-3 text-sm">
                {t.providers[preset.id]}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="apiKey">{t.apiKey}</Label>
            <Input
              id="apiKey"
              type="password"
              autoComplete="off"
              value={settings.apiKey}
              onChange={(event) => persist({ ...settings, apiKey: event.target.value })}
              placeholder={t.keyHints[settings.provider]}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="model">{t.model}</Label>
            <Input
              id="model"
              value={settings.model}
              onChange={(event) => persist({ ...settings, model: event.target.value })}
              placeholder={preset.model || t.modelName}
            />
          </div>
          {settings.provider === "custom" ? (
            <div className="space-y-1.5">
              <Label htmlFor="customBaseUrl">{t.baseUrl}</Label>
              <Input
                id="customBaseUrl"
                value={settings.customBaseUrl}
                onChange={(event) =>
                  persist({ ...settings, customBaseUrl: event.target.value })
                }
                placeholder="https://api.example.com/v1"
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="temperature">{t.temperature} {settings.temperature.toFixed(1)}</Label>
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
            {testing ? <Loader2 className="animate-spin" /> : <Unplug />}
            {t.testConn}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
