import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { categories, websites } from "@/lib/onewebs-data";

const URL = "https://find-best-sites.lovable.app/categories";
const TITLE = "All Categories — OneWebs";
const DESC = "Browse every OneWebs category — from AI chatbots and learning to shopping, health and travel.";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const counts: Record<string, number> = {};
  for (const w of websites) counts[w.category] = (counts[w.category] ?? 0) + 1;

  return (
    <PageShell
      kicker="Browse"
      title="Every category on OneWebs."
      intro="Pick a category and jump straight to the handpicked sites inside it."
    >
      <div className="not-prose grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/"
            hash={`cat-${c.id}`}
            className={`flex items-center gap-3 rounded-2xl border border-slate-100 ${c.tint} p-4 transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 shadow-sm">
              <c.icon className={`h-5 w-5 ${c.iconColor}`} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-900">
                {c.name}
              </span>
              <span className="text-xs text-slate-500">
                {counts[c.id] ?? 0} websites
              </span>
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}