"use client";

import { FaqList } from "@/components/faq-list";
import { useLocale } from "@/lib/locale";

export function HowToUse({ embedded = false }: { embedded?: boolean }) {
  const { t, locale } = useLocale();
  const config = locale === "en" ? "/live-panel/heyi-en.json" : "/live-panel/heyi-zh.json";

  return (
    <div className="home-section space-y-8" id="guide">
      <section className="space-y-3">
        {embedded ? (
          <h2 className="font-heading text-3xl md:text-4xl">{t.guideTitle}</h2>
        ) : (
          <h1 className="font-heading text-3xl md:text-4xl">{t.guideTitle}</h1>
        )}
      </section>

      <div className="live-panel">
        <iframe
          key={locale}
          src={`/live-panel/template.html?config=${encodeURIComponent(config)}`}
          title={t.panelAria}
          className="live-panel__frame"
        />
      </div>

      <FaqList embedded />
    </div>
  );
}
