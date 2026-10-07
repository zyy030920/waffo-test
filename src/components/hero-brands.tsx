"use client";

export function HeroBrands({ lines }: { lines: readonly string[] }) {
  return (
    <div className="hero-brands" aria-label={lines.join(" · ")}>
      {lines.map((line, index) => (
        <p
          key={line}
          className="hero-brands__item"
          style={{ animationDelay: `${index * 3.6}s` }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
