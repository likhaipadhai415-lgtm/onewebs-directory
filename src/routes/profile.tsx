import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { websites, faviconFor } from "@/lib/onewebs-data";
import { Heart, ExternalLink, Trash2, User } from "lucide-react";

const URL = "https://find-best-sites.lovable.app/profile";
const TITLE = "Your Profile — OneWebs";
const DESC = "Your favorites and preferences on OneWebs, stored privately on your own device.";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "profile" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ProfilePage,
});

const FAV_KEY = "onewebs.favorites";

function ProfilePage() {
  const [favs, setFavs] = useState<string[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavs(JSON.parse(raw));
      setName(localStorage.getItem("onewebs.name") ?? "");
    } catch { /* ignore */ }
  }, []);

  const remove = (n: string) => {
    const next = favs.filter((x) => x !== n);
    setFavs(next);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const clearAll = () => {
    setFavs([]);
    try { localStorage.removeItem(FAV_KEY); } catch { /* ignore */ }
  };

  const saveName = (n: string) => {
    setName(n);
    try { localStorage.setItem("onewebs.name", n); } catch { /* ignore */ }
  };

  const favSites = websites.filter((w) => favs.includes(w.name));

  return (
    <PageShell
      kicker="Your Profile"
      title={name ? `Hi, ${name}.` : "Your OneWebs profile."}
      intro="Everything on this page is saved locally in your browser. Nothing is uploaded — clear your browser storage and it's gone."
    >
      <h2>Display name</h2>
      <div className="not-prose flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-blue-700">
          <User className="h-5 w-5" />
        </div>
        <input
          value={name}
          onChange={(e) => saveName(e.target.value)}
          placeholder="What should we call you?"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <h2>Favorites ({favSites.length})</h2>
      {favSites.length === 0 ? (
        <div className="not-prose rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          You haven't hearted any websites yet. Tap the{" "}
          <Heart className="inline h-3.5 w-3.5 align-[-2px]" /> on any card to
          save it here.
        </div>
      ) : (
        <>
          <div className="not-prose grid gap-3 sm:grid-cols-2">
            {favSites.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                <img
                  src={faviconFor(s.domain)}
                  alt=""
                  className="h-8 w-8 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">{s.name}</div>
                  <div className="truncate text-xs text-slate-500">{s.domain}</div>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                  aria-label={`Open ${s.name}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => remove(s.name)}
                  aria-label={`Remove ${s.name}`}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={clearAll}
            className="mt-4 text-xs font-medium text-rose-600 hover:underline"
          >
            Clear all favorites
          </button>
        </>
      )}
    </PageShell>
  );
}