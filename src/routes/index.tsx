import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Heart, ExternalLink, Share2, ChevronRight, User, Info, Menu, X,
} from "lucide-react";
import {
  categories, websites, categoryById, faviconFor,
  type Website, type Pricing,
} from "@/lib/onewebs-data";
import { SiteFooter } from "@/components/SiteFooter";
import { Highlight, tokenize } from "@/components/Highlight";
import { useApprovedSites } from "@/hooks/use-approved-sites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OneWebs — One Place. Every Website." },
      { name: "description", content: "Discover 1000+ handpicked websites across 100+ categories — AI tools, learning, productivity, shopping, and more." },
      { property: "og:title", content: "OneWebs — One Place. Every Website." },
      { property: "og:description", content: "Discover handpicked websites across AI, learning, productivity, shopping, and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://onewebs.vercel.app/onewebs-mark.png" },
      { name: "twitter:image", content: "https://onewebs.vercel.app/onewebs-mark.png" },
      { name: "google-site-verification", content: "q63Xs7Y8fDgb72-p_NmPLGvPmXWAStlzrO-cGugrVGI" },
    ],
  }),
  component: OneWebsHome,
});

type Filter = "All" | "Free" | "Freemium" | "Paid" | "Popular" | "New";

function OneWebsHome() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showRankInfo, setShowRankInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: approvedExtras = [] } = useApprovedSites();
  const allSites = useMemo(() => [...websites, ...approvedExtras], [approvedExtras]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("onewebs.favorites");
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("onewebs.favorites", JSON.stringify([...favorites]));
    } catch { /* ignore */ }
  }, [favorites]);

  const tokens = tokenize(query);
  const isSearching = tokens.length > 0;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of allSites) map[w.category] = (map[w.category] ?? 0) + 1;
    return map;
  }, [allSites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    const matchesFilter = (w: Website) => {
      if (filter === "All") return true;
      if (filter === "Popular") return !!w.popular;
      if (filter === "New") return !!w.isNew;
      if (filter === "Free") return w.pricing === "Free" || w.pricing === "Free + Paid";
      if (filter === "Freemium") return w.pricing === "Freemium";
      if (filter === "Paid") return w.pricing === "Paid" || w.pricing === "Free + Paid";
      return true;
    };

    const scoreOf = (w: Website) => {
      if (tokens.length === 0) return 0;
      const name = w.name.toLowerCase();
      const desc = w.description.toLowerCase();
      const domain = w.domain.toLowerCase();
      const cat = (categoryById(w.category)?.name ?? w.category).toLowerCase();
      const catId = w.category.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        let hit = 0;
        if (name === t) hit += 100;
        else if (name.startsWith(t)) hit += 60;
        else if (name.includes(t)) hit += 40;
        if (cat === t || catId === t) hit += 50;
        else if (cat.includes(t) || catId.includes(t)) hit += 25;
        if (domain.includes(t)) hit += 20;
        if (desc.includes(t)) hit += 10;
        if (hit === 0) return -1; // token unmatched → drop
        score += hit;
      }
      if (w.popular) score += 5;
      if (w.isNew) score += 3;
      return score;
    };

    const scored = allSites
      .filter(matchesFilter)
      .map((w) => ({ w, s: scoreOf(w) }))
      .filter(({ s }) => s >= 0);

    if (tokens.length > 0) {
      scored.sort((a, b) => b.s - a.s);
    }
    return scored.map(({ w }) => w);
  }, [query, filter, allSites]);

  const toggleFav = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const share = async (site: Website) => {
    const shareData = { title: site.name, text: site.description, url: site.url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(site.url); } catch { /* ignore */ }
    }
  };

  const featured = allSites.filter((w) => w.popular).slice(0, 3);
  const bentoCats = categories.slice(0, 6);
  const navCls = "text-slate-600 transition hover:text-slate-900";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/onewebs-mark.png" alt="OneWebs logo" className="ow-logo h-8 w-8 shrink-0 rounded-full object-cover" />
            <span className="font-display text-2xl leading-none">
              One<span className="italic text-blue-600">Webs</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm lg:flex">
            <Link to="/categories" className={navCls}>Categories</Link>
            <Link to="/trending" className={navCls}>Trending</Link>
            <Link to="/new" className={navCls}>New</Link>
            <Link to="/about" className={navCls}>About</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/profile" aria-label="Account" className="hidden h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 sm:grid">
              <User className="h-4 w-4" />
            </Link>
            <Link to="/submit" className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 md:inline-flex">
              Submit a site
            </Link>
            <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 lg:hidden">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="grid gap-1 border-t border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 lg:hidden">
            {([["/categories","Categories"],["/trending","Trending"],["/new","New Websites"],["/about","About"],["/profile","Profile"]] as const).map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-50">{label}</Link>
            ))}
            <Link to="/submit" onClick={() => setMenuOpen(false)} className="mt-1 rounded-full bg-slate-900 px-3 py-2 text-center text-white">Submit a site</Link>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="pb-10 pt-12 text-center sm:pb-14 sm:pt-20">
          <p data-scroll-reveal className="text-xs font-medium uppercase tracking-[0.2em] text-blue-600">One place · Every website</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-[44px] leading-[1.02] tracking-tight sm:text-7xl">
            The web's best sites, <span className="italic text-blue-600">beautifully</span> organized.
          </h1>
          <p data-scroll-reveal className="mx-auto mt-5 max-w-xl text-base text-slate-600">
            A handpicked directory of AI tools, learning platforms, productivity apps and more — no endless Googling.
          </p>
          <div className="ow-fade-up sticky top-[64px] z-30 mx-auto mt-8 max-w-xl [animation-delay:180ms]">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-[0_10px_40px_-12px_rgb(37_99_235/0.25)] focus-within:border-blue-400">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search websites, categories, tools…"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400" />
              {query && <button onClick={() => setQuery("")} aria-label="Clear"><X className="h-4 w-4 text-slate-400" /></button>}
            </div>
          </div>
        </section>

        {/* Bento */}
        {!isSearching && (
          <section id="categories" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]">
            <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-blue-300">Editor's picks</span>
                <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Start with the <span className="italic">essentials</span>.</h2>
              </div>
              <div className="mt-8 space-y-2">
                {featured.map((s) => (
                  <a key={s.name} href={s.url.startsWith("http") ? s.url : `https://${s.url}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 transition hover:bg-white/10">
                    <img src={s.logoUrl ?? faviconFor(s.domain)} alt="" className="h-9 w-9 rounded-lg bg-white p-1" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="truncate text-xs text-white/60">{s.description}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-white/50" />
                  </a>
                ))}
              </div>
            </div>
            {bentoCats.map((c, i) => (
              <a key={c.id} href={`#cat-${c.id}`}
                className={`ow-card group flex flex-col justify-between rounded-3xl border border-slate-200 p-5 hover:border-blue-300 ${i === 0 ? "bg-blue-50" : "bg-white"} ${i >= 4 ? "lg:col-span-2" : ""}`}>
                <c.icon className={`h-6 w-6 ${c.iconColor}`} />
                <div className="mt-8">
                  <div data-scroll-reveal className="font-display text-2xl leading-tight">{c.name}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    {counts[c.id] ?? 0} websites
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
            <Link to="/categories" className="col-span-2 flex items-center justify-between rounded-3xl border border-dashed border-slate-300 p-5 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 lg:col-span-4">
              Browse all {categories.length} categories <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {/* Results */}
        <section id="popular" className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-4xl">{isSearching ? "Results" : "Popular right now"}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {isSearching ? `${filtered.length} matches, ranked by relevance` : "The most useful sites, handpicked."}
                <button onClick={() => setShowRankInfo((v) => !v)} className="ml-2 inline-flex align-middle text-slate-400 hover:text-slate-700" aria-label="How ranking works">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </p>
            </div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
              {(["All", "Free", "Freemium", "Paid", "Popular", "New"] as Filter[]).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {showRankInfo && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
              <div className="mb-1 font-semibold text-slate-900">How results are ranked</div>
              Every result must match all your terms. Exact name +100 · name starts +60 · exact category +50 · name contains +40 · category contains +25 · domain +20 · description +10 · popular +5 · new +3.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, isSearching ? 60 : 12).map((site) => (
              <WebsiteCard key={site.name} site={site} tokens={tokens} isFav={favorites.has(site.name)}
                onToggleFav={() => toggleFav(site.name)} onShare={() => share(site)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-500">
              No websites match your search.
            </div>
          )}
        </section>

        {!isSearching && categories.map((c) => {
          const items = filtered.filter((w) => w.category === c.id);
          if (items.length === 0) return null;
          return (
            <section key={c.id} id={`cat-${c.id}`} className="mt-16 scroll-mt-24">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <c.icon className={`h-5 w-5 ${c.iconColor}`} />
                <h3 className="font-display text-3xl">{c.name}</h3>
                <span className="text-sm text-slate-400">{counts[c.id]}</span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((site) => (
                  <WebsiteCard key={site.name} site={site} tokens={tokens} isFav={favorites.has(site.name)}
                    onToggleFav={() => toggleFav(site.name)} onShare={() => share(site)} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}

function PricingBadge({ pricing }: { pricing: Pricing }) {
  const styles: Record<Pricing, string> = {
    "Free": "bg-emerald-50 text-emerald-700",
    "Paid": "bg-amber-50 text-amber-700",
    "Freemium": "bg-violet-50 text-violet-700",
    "Free + Paid": "bg-blue-50 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${styles[pricing]}`}>
      {pricing}
    </span>
  );
}

function WebsiteCard({
  site, isFav, onToggleFav, onShare, tokens = [],
}: { site: Website; isFav: boolean; onToggleFav: () => void; onShare: () => void; tokens?: string[] }) {
  const cat = categoryById(site.category);
  const [imgError, setImgError] = useState(false);
  const initial = site.name[0]?.toUpperCase() ?? "?";

  const normalizedUrl = (() => {
    const raw = (site.url ?? "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw.replace(/^\/+/, "")}`;
  })();
  let isValid = false;
  try {
    if (normalizedUrl) {
      const u = new URL(normalizedUrl);
      isValid = u.protocol === "http:" || u.protocol === "https:";
    }
  } catch {
    isValid = false;
  }

  return (
    <div className="ow-card ow-pop group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-[0_10px_40px_-12px_rgb(37_99_235/0.25)]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          {!imgError ? (
            <img
              src={site.logoUrl ?? faviconFor(site.domain)}
              onError={() => setImgError(true)}
              alt={`${site.name} logo`}
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-lg font-bold text-slate-500">{initial}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate text-sm font-semibold text-slate-900">
              <Highlight text={site.name} tokens={tokens} />
            </span>
            {site.official && (
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-blue-500" aria-label="Verified">
                <path d="M12 2l2.09 2.26L17 3.5l.5 3.09L20.5 8l-1.24 2.91L20.5 14l-2.91 1.5-.5 3.09-2.91-.76L12 20l-2.18-2.17-2.91.76-.5-3.09L3.5 14l1.24-3.09L3.5 8l2.91-1.41.5-3.09 2.91.76z" />
                <path d="M10.5 13.7l4.4-4.4-1.06-1.06-3.34 3.34-1.44-1.44L8 11.2z" fill="#fff" />
              </svg>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            <Highlight text={site.description} tokens={tokens} />
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {cat && (
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${cat.tint} ${cat.iconColor}`}>
            {cat.name}
          </span>
        )}
        <PricingBadge pricing={site.pricing} />
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
        {isValid ? (
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="truncate">Open Website</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-w-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-500"
          >
            Website unavailable
          </span>
        )}
        <button
          onClick={onToggleFav}
          aria-label="Favorite"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition ${
            isFav
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-rose-500" : ""}`} />
        </button>
        <button
          onClick={onShare}
          aria-label="Share"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}