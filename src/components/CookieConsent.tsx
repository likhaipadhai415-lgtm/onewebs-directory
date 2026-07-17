import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const KEY = "onewebs.cookieConsent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setShow(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md"
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
        <button
          onClick={() => decide("declined")}
          aria-label="Dismiss"
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 pr-6">
            <h3 className="text-sm font-semibold text-slate-900">
              We use cookies
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              OneWebs stores small preferences on your device — favorites,
              recently viewed sites, and your theme — to keep the experience
              smooth. No third-party tracking.{" "}
              <Link to="/cookies" className="font-semibold text-blue-600 hover:underline">
                Learn more
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => decide("accepted")}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Accept all
              </button>
              <button
                onClick={() => decide("declined")}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Only essential
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}