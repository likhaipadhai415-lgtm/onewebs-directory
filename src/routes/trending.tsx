import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { websites, faviconFor, categoryById } from "@/lib/onewebs-data";
import { useApprovedSites } from "@/hooks/use-approved-sites";
import { ExternalLink } from "lucide-react";

const URL = "https://find-best-sites.lovable.app/trending";
const TITLE = "Trending Websites — OneWebs";
const DESC = "The most popular websites on OneWebs right now, ranked by community picks.";

export const Route = createFileRoute("/trending")({
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
  component: TrendingPage,
});

function TrendingPage() {
  const { data: extras = [] } = useApprovedSites();
  const list = [...websites, ...extras].filter((w) => w.popular);
  return (
    <PageShell kicker="Trending" title="What's popular on OneWebs." intro="Handpicked sites the community keeps coming back to.">
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        {list.map((s) => {
          const cat = categoryById(s.category);
          return (
            <div key={s.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
              <img src={s.logoUrl ?? faviconFor(s.domain)} alt="" className="h-8 w-8 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">{s.name}</div>
                <div className="truncate text-xs text-slate-500">{cat?.name}</div>
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label={`Open ${s.name}`}>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Looking for something specific? Try the <Link to="/" className="text-blue-600 hover:underline">search on the homepage</Link>.
      </p>
    </PageShell>
  );
}