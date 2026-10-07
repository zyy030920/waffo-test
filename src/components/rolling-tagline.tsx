"use client";

export function RollingTagline({
  lines,
  hero = false,
}: {
  lines: readonly string[];
  hero?: boolean;
}) {
  const frames = [...lines, lines[0]];
  return (
    <div
      className={hero ? "roll-tagline roll-tagline--hero" : "roll-tagline"}
      aria-label={lines.join(" · ")}
    >
      <div className="roll-tagline__track">
        {frames.map((line, index) => (
          <p key={`${line}-${index}`} className="roll-tagline__item">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
