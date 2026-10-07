"use client";

import { useParams } from "next/navigation";

import { QuietLink } from "@/components/quiet-link";
import { getCategory, getPost } from "@/lib/blog";
import { useLocale } from "@/lib/locale";

export default function BlogPostPage() {
  const { t, locale } = useLocale();
  const params = useParams<{ slug: string }>();
  const post = getPost(String(params.slug ?? ""));
  const zh = locale === "zh";

  if (!post) {
    return (
      <article className="legal-page">
        <h1 className="font-heading text-3xl">{zh ? "未找到文章" : "Post not found"}</h1>
        <p className="mt-6">
          <QuietLink href="/blog">{t.blogBack}</QuietLink>
        </p>
      </article>
    );
  }

  const title = zh ? post.title.zh : post.title.en;
  const dek = zh ? post.dek.zh : post.dek.en;
  const sources = zh ? post.sources.zh : post.sources.en;
  const body = zh ? post.body.zh : post.body.en;
  const category = getCategory(post.category);

  return (
    <article className="legal-page blog-post">
      <p className="blog-post__kicker">
        <QuietLink href="/blog">{t.blogBack}</QuietLink>
        {category ? (
          <QuietLink href={`/blog#${category.id}`}>{zh ? category.title.zh : category.title.en}</QuietLink>
        ) : null}
        <span>{post.date}</span>
      </p>
      <h1 className="font-heading text-3xl md:text-4xl">{title}</h1>
      <p className="text-muted-foreground mt-3 text-sm md:text-base">{dek}</p>
      <div className="legal-page__body">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="blog-post__sources">
        <strong>{t.blogSources}</strong>
        {sources}
      </p>
    </article>
  );
}
