"use client";

export function LegalArticle({
  title,
  lead,
  body,
}: {
  title: string;
  lead: string;
  body: readonly string[];
}) {
  return (
    <article className="legal-page">
      <h1 className="font-heading text-3xl md:text-4xl">{title}</h1>
      <p className="text-muted-foreground mt-3 text-sm md:text-base">{lead}</p>
      <div className="legal-page__body">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
