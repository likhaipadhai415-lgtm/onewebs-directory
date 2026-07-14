import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Command, Home, LayoutGrid, TrendingUp, Sparkles, Heart, Clock,
  Flame, ExternalLink, Share2, ChevronRight, Moon, User, Globe,
} from "lucide-react";
import {
  categories, websites, categoryById, faviconFor,
  type Website, type Pricing,
} from "@/lib/onewebs-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OneWebs — One Place. Every Website." },
      { name: "description", content: "Discover 1000+ handpicked websites across 100+ categories — AI tools, learning, productivity, shopping, and more." },
    ],
  }),
  component: OneWebsHome,
});

type Filter = "All" | "Free" | "Freemium" | "Paid" | "Popular" | "New";

function OneWebsHome() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of websites) map[w.category] = (map[w.category] ?? 0) + 1;
    return map;
  }, []);

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

    const scored = websites
      .filter(matchesFilter)
      .map((w) => ({ w, s: scoreOf(w) }))
      .filter(({ s }) => s >= 0);

    if (tokens.length > 0) {
      scored.sort((a, b) => b.s - a.s);
    }
    return scored.map(({ w }) => w);
  }, [query, filter]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = () => websites.filter((w) => {
      if (q && !(
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.domain.toLowerCase().includes(q)
      )) return false;
      if (filter === "All") return true;
      if (filter === "Popular") return !!w.popular;
      if (filter === "New") return !!w.isNew;
      if (filter === "Free") return w.pricing === "Free" || w.pricing === "Free + Paid";
      if (filter === "Freemium") return w.pricing === "Freemium";
      if (filter === "Paid") return w.pricing === "Paid" || w.pricing === "Free + Paid";
      return true;
    });

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

  const topSidebarCats = categories.slice(0, 7);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:grid-cols-[240px_minmax(0,1fr)_auto] sm:px-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <span className="truncate text-xl font-bold tracking-tight">
              One<span className="text-blue-600">Webs</span>
            </span>
          </a>

          {/* Search (desktop) */}
          <div className="hidden sm:block">
            <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-slate-50/70 px-4 py-2 text-sm text-slate-500 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="h-4 w-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search websites, categories, tools..."
                className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              />
              <span className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                <Command className="h-3 w-3" /> /
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
              <a href="#" className="hover:text-slate-900">Home</a>
              <a href="#categories" className="hover:text-slate-900">Categories</a>
              <a href="#popular" className="hover:text-slate-900">Trending</a>
              <a href="#popular" className="hover:text-slate-900">New</a>
              <a href="#" className="hover:text-slate-900">About</a>
            </nav>
            <button className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 md:inline-flex">
              Submit Website
            </button>
            <button aria-label="Theme" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 sm:inline-flex">
              <Moon className="h-4 w-4" />
            </button>
            <button aria-label="Account" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 sm:inline-flex">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <nav className="space-y-1">
            <SidebarItem icon={Home} label="Home" active />
            <SidebarItem icon={LayoutGrid} label="Categories" />
            <SidebarItem icon={TrendingUp} label="Trending" />
            <SidebarItem icon={Sparkles} label="New Websites" />
            <SidebarItem icon={Heart} label="Favorites" badge={favorites.size || undefined} />
            <SidebarItem icon={Clock} label="Recently Viewed" />
          </nav>

          <div className="mt-8">
            <div className="px-3 text-[11px] font-semibold tracking-widest text-slate-400">TOP CATEGORIES</div>
            <div className="mt-2 space-y-1">
              {topSidebarCats.map((c) => (
                <a
                  key={c.id}
                  href={`#cat-${c.id}`}
                  className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <c.icon className={`h-4 w-4 shrink-0 ${c.iconColor}`} />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">{counts[c.id] ?? 0}</span>
                </a>
              ))}
              <a href="#categories" className="block px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                View All Categories
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-900 p-5 text-center text-white">
            <div className="text-sm font-semibold">Discover. Explore. Save.</div>
            <p className="mt-2 text-xs text-white/70">One place for all the best websites in the world.</p>
            <button className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50">
              Explore Now
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 space-y-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> One Place. Every Website.
                </span>
                <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Discover the Best Websites
                  <br className="hidden sm:block" />
                  in <span className="text-blue-600">One Place</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Find AI tools, learning platforms, productivity apps, shopping sites, entertainment, and thousands more — all organized by category.
                </p>

                <div className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                    <Search className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search websites..."
                      className="w-full min-w-0 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
                    Search
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <HeroChip icon={LayoutGrid} label="100+ Categories" />
                  <HeroChip icon={Globe} label="1000+ Websites" />
                  <HeroChip icon={Sparkles} label="100% Free" color="text-emerald-600" />
                  <HeroChip icon={Clock} label="Daily Updates" color="text-violet-600" />
                </div>
              </div>

              {/* Decorative icon grid */}
              <div className="hidden lg:block">
                <HeroIconGrid />
              </div>
            </div>
          </section>

          {/* Category quick strip */}
          <section id="categories" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.slice(0, 6).map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className={`group flex items-center gap-3 rounded-2xl border border-slate-100 ${c.tint} p-4 transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/70 shadow-sm">
                  <c.icon className={`h-5 w-5 ${c.iconColor}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">{c.name}</span>
                  <span className="text-xs text-slate-500">{counts[c.id] ?? 0} Websites</span>
                </span>
              </a>
            ))}
            <a href="#categories" className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100">
                <LayoutGrid className="h-5 w-5 text-slate-500" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">More</span>
                <span className="text-xs text-slate-500">Categories</span>
              </span>
            </a>
          </section>

          {/* Popular */}
          <section id="popular">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-100">
                    <Flame className="h-4 w-4 text-orange-500" />
                  </span>
                  <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">Popular Websites</h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">Most popular and useful websites handpicked for you</p>
              </div>
              <button className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                View All
              </button>
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {(["All", "Free", "Freemium", "Paid", "Popular", "New"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      filter === f
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="hidden shrink-0 text-xs text-slate-500 sm:block">
                Sort by: <span className="font-medium text-slate-700">Popular</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filtered.slice(0, 20).map((site) => (
                <WebsiteCard
                  key={site.name}
                  site={site}
                  isFav={favorites.has(site.name)}
                  onToggleFav={() => toggleFav(site.name)}
                  onShare={() => share(site)}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                No websites match your search.
              </div>
            )}
          </section>

          {/* All categories with sections */}
          {categories.map((c) => {
            const items = filtered.filter((w) => w.category === c.id);
            if (items.length === 0) return null;
            return (
              <section key={c.id} id={`cat-${c.id}`}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.tint}`}>
                      <c.icon className={`h-5 w-5 ${c.iconColor}`} />
                    </span>
                    <h3 className="truncate text-lg font-bold text-slate-900">{c.name}</h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {counts[c.id]}
                    </span>
                  </div>
                  <a href="#" className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                    View all <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {items.map((site) => (
                    <WebsiteCard
                      key={site.name}
                      site={site}
                      isFav={favorites.has(site.name)}
                      onToggleFav={() => toggleFav(site.name)}
                      onShare={() => share(site)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <footer className="border-t border-slate-100 pt-8 pb-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} OneWebs — One Place. Every Website.
          </footer>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon, label, active, badge,
}: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; badge?: number }) {
  return (
    <a
      href="#"
      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {badge ? (
        <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">{badge}</span>
      ) : null}
    </a>
  );
}

function HeroChip({
  icon: Icon, label, color = "text-blue-600",
}: { icon: React.ComponentType<{ className?: string }>; label: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 backdrop-blur">
      <Icon className={`h-3.5 w-3.5 ${color}`} /> {label}
    </span>
  );
}

function HeroIconGrid() {
  const cats = categories.slice(0, 18);
  return (
    <div className="relative w-[380px] rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs font-semibold text-slate-500">OneWebs</span>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {cats.map((c) => (
          <div key={c.id} className={`grid aspect-square place-items-center rounded-xl ${c.tint}`}>
            <c.icon className={`h-5 w-5 ${c.iconColor}`} />
          </div>
        ))}
      </div>
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
  site, isFav, onToggleFav, onShare,
}: { site: Website; isFav: boolean; onToggleFav: () => void; onShare: () => void }) {
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
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          {!imgError ? (
            <img
              src={faviconFor(site.domain)}
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
            <span className="truncate text-sm font-semibold text-slate-900">{site.name}</span>
            {site.official && (
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-blue-500" aria-label="Verified">
                <path d="M12 2l2.09 2.26L17 3.5l.5 3.09L20.5 8l-1.24 2.91L20.5 14l-2.91 1.5-.5 3.09-2.91-.76L12 20l-2.18-2.17-2.91.76-.5-3.09L3.5 14l1.24-3.09L3.5 8l2.91-1.41.5-3.09 2.91.76z" />
                <path d="M10.5 13.7l4.4-4.4-1.06-1.06-3.34 3.34-1.44-1.44L8 11.2z" fill="#fff" />
              </svg>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{site.description}</p>
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
            className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
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