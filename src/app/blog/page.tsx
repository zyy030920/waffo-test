"use client";

import { postsByCategory } from "@/lib/blog";
import { QuietLink } from "@/components/quiet-link";
import { useLocale } from "@/lib/locale";

export default function BlogPage() {
  const { t, locale } = useLocale();
  const zh = locale === "zh";

  return (
    <div className="legal-page blog-index">
      <h1 className="font-heading text-3xl md:text-4xl">{t.blogTitle}</h1>
      <p className="text-muted-foreground mt-3 text-sm md:text-base">{t.blogLead}</p>

      {postsByCategory().map((section) => (
        <section key={section.id} className="blog-type" id={section.id}>
          <h2>{zh ? section.title.zh : section.title.en}</h2>
          <p className="blog-type__dek">{zh ? section.dek.zh : section.dek.en}</p>
          <ol className="blog-index__list">
            {section.posts.map((post) => (
              <li key={post.slug}>
                <QuietLink href={`/blog/${post.slug}`} className="blog-card">
                  <span className="blog-card__date">{post.date}</span>
                  <strong>{zh ? post.title.zh : post.title.en}</strong>
                  <span>{zh ? post.dek.zh : post.dek.en}</span>
                </QuietLink>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
