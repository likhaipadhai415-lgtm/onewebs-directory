import { type ReactNode } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Highlight({
  text,
  tokens,
  className = "",
}: {
  text: string;
  tokens: string[];
  className?: string;
}) {
  const clean = tokens.filter((t) => t.trim().length > 0);
  if (clean.length === 0) return <>{text}</>;
  const re = new RegExp(`(${clean.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i): ReactNode => {
        if (i % 2 === 1) {
          return (
            <mark
              key={i}
              className={`rounded bg-yellow-200/70 px-0.5 text-slate-900 ${className}`}
            >
              {p}
            </mark>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}