import { Link } from "@tanstack/react-router";
import { Globe, ArrowLeft } from "lucide-react";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  title,
  kicker,
  intro,
  children,
}: {
  title: string;
  kicker?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              One<span className="text-blue-600">Webs</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <Link to="/categories" className="hover:text-slate-900">Categories</Link>
            <Link to="/trending" className="hover:text-slate-900">Trending</Link>
            <Link to="/about" className="hover:text-slate-900">About</Link>
            <Link to="/contact" className="hover:text-slate-900">Contact</Link>
          </nav>
          <Link
            to="/submit"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm"
          >
            Submit Website
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        {kicker && (
          <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-blue-600">
            {kicker}
          </div>
        )}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {intro && <p className="mt-3 text-base text-slate-600">{intro}</p>}
        <div className="prose prose-slate mt-8 max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-xl prose-h3:text-base prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}