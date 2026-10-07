"use client";

import { useLocale } from "@/lib/locale";

export function FaqList({ embedded = false }: { embedded?: boolean }) {
  const { t } = useLocale();
  const items = [t.faq.about, t.faq.agents, t.faq.verify, t.faq.sign, t.faq.domain, t.faq.trial];

  return (
    <div className="space-y-6" id="faq">
      {embedded ? null : (
        <section className="space-y-3">
          <h1 className="font-heading text-3xl md:text-4xl">{t.faqTitle}</h1>
        </section>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-none border border-[color:var(--line)] bg-[color:var(--fill-ghost)] px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              {item.q}
            </summary>
            <p className="text-muted-foreground mt-3 text-sm leading-7">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
