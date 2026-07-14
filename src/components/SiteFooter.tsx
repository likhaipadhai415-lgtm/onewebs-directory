import { Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-slate-100 bg-white">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              One<span className="text-blue-600">Webs</span>
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            One place for all the best websites in the world — handpicked and
            organized by category so you never have to search Google again.
          </p>
        </div>

        <FooterCol title="Explore">
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/categories">Categories</FooterLink>
          <FooterLink to="/trending">Trending</FooterLink>
          <FooterLink to="/new">New Websites</FooterLink>
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/submit">Submit Website</FooterLink>
          <FooterLink to="/profile">Profile</FooterLink>
        </FooterCol>

        <FooterCol title="Legal">
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/terms">Terms &amp; Conditions</FooterLink>
          <FooterLink to="/cookies">Cookie Policy</FooterLink>
          <FooterLink to="/disclaimer">Disclaimer</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>© {year} OneWebs — One Place. Every Website.</span>
          <span className="text-slate-400">
            Made for the curious. All logos belong to their respective owners.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="transition hover:text-blue-600"
        activeProps={{ className: "text-blue-600 font-medium" }}
      >
        {children}
      </Link>
    </li>
  );
}