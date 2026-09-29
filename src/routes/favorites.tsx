import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { websites, faviconFor } from "@/lib/onewebs-data";
import { useApprovedSites } from "@/hooks/use-approved-sites";
import { Heart, ExternalLink, Trash2 } from "lucide-react";

const URL = "https://onewebs.vercel.app/favorites";
const TITLE = "My Favorite Websites — OneWebs";
const DESC = "Your saved favorite websites on OneWebs, ready to open in one tap.";
const FAV_KEY = "onewebs.favorites";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: FavoritesPage,
});

function normalize(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function FavoritesPage() {
  const [favs, setFavs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const { data: extras = [] } = useApprovedSites();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const save = (next: string[]) => {
    setFavs(next);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const sites = useMemo(() => {
    const all = [...websites, ...extras];
    const q = query.trim().toLowerCase();
    return favs
      .map((n) => all.find((w) => w.name === n))
      .filter((w): w is NonNullable<typeof w> => !!w)
      .filter((w) => !q || w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q));
  }, [favs, extras, query]);

  return (
    <PageShell
      kicker="Saved"
      title="Your favorite websites."
      intro="Tap the heart on any website card to save it here. Your list stays on this device."
    >
      {favs.length === 0 ? (
        <div className="not-prose rounded-3xl border border-dashed border-slate-200 p-10 text-center">
          <Heart className="mx-auto h-8 w-8 text-rose-400" />
          <p className="mt-3 text-sm text-slate-600">No favorites yet.</p>
          <Link to="/" className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
            Browse websites
          </Link>
        </div>
      ) : (
        <div className="not-prose">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your favorites…"
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <span className="text-sm text-slate-500">{favs.length} saved</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sites.map((s) => (
              <div key={s.name} data-scroll-reveal className="ow-card flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4">
                <img src={s.logoUrl || faviconFor(s.domain)} alt="" className="h-10 w-10 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <div className="ow-site-name truncate font-semibold text-slate-900">{s.name}</div>
                  <div className="truncate text-xs text-slate-500">{s.category} · {s.domain}</div>
                </div>
                <a href={normalize(s.url)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600">
                  Open <ExternalLink className="h-3 w-3" />
                </a>
                <button onClick={() => save(favs.filter((x) => x !== s.name))} aria-label={`Remove ${s.name}`}
                  className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-rose-500 hover:bg-rose-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          {sites.length === 0 && <p className="text-sm text-slate-500">No favorites match your search.</p>}
          <button onClick={() => save([])} className="mt-5 text-xs font-medium text-rose-600 hover:underline">
            Clear all favorites
          </button>
        </div>
      )}
    </PageShell>
  );
}
