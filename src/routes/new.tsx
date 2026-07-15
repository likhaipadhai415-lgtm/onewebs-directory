import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { websites, faviconFor, categoryById } from "@/lib/onewebs-data";
import { useApprovedSites } from "@/hooks/use-approved-sites";
import { ExternalLink, Sparkles } from "lucide-react";

const URL = "https://find-best-sites.lovable.app/new";
const TITLE = "New Websites — OneWebs";
const DESC = "The latest websites added to the OneWebs directory.";

export const Route = createFileRoute("/new")({
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
  component: NewPage,
});

function NewPage() {
  const { data: extras = [] } = useApprovedSites();
  const list = [...websites, ...extras].filter((w) => w.isNew);
  return (
    <PageShell kicker="New" title="Fresh additions to OneWebs." intro="Recently added — worth checking out.">
      {list.length === 0 ? (
        <div className="not-prose flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-8 text-sm text-slate-500">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Nothing marked as new right now. Browse everything on the <Link to="/" className="text-blue-600 hover:underline">homepage</Link>.
        </div>
      ) : (
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
      )}
    </PageShell>
  );
}