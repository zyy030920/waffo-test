"use client";

import { QuietLink } from "@/components/quiet-link";
import { useLocale } from "@/lib/locale";

function featureHref(title: string) {
  if (title === "译评对照" || title === "Appraisal") return "/practice";
  return "";
}

export function HomeFeatures() {
  const { t } = useLocale();

  return (
    <section className="home-section" id="features">
      <p className="chip" suppressHydrationWarning>{t.featuresKicker}</p>
      <h2 className="home-section__title">{t.featuresTitle}</h2>
      <div className="feature-grid">
        {t.features.map((item) => {
          const href = featureHref(item.title);
          const body = (
            <>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </>
          );
          if (href) {
            return (
              <QuietLink key={item.title} href={href} className="feature-card feature-card--link">
                {body}
              </QuietLink>
            );
          }
          return (
            <article key={item.title} className="feature-card">
              {body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
