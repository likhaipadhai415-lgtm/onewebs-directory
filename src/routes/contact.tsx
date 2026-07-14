import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Mail, MessageSquare, Send } from "lucide-react";

const URL = "https://find-best-sites.lovable.app/contact";
const TITLE = "Contact OneWebs — Get in touch";
const DESC = "Questions, partnerships, corrections or feedback — reach the OneWebs team.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell
      kicker="Contact"
      title="Talk to the OneWebs team."
      intro="Partnerships, corrections, takedown requests, feedback — we read every message."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <Mail className="h-5 w-5 text-blue-600" />
          <div className="mt-3 text-sm font-semibold text-slate-900">Email us</div>
          <a href="mailto:hello@onewebs.app" className="text-sm text-blue-600">
            hello@onewebs.app
          </a>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <div className="mt-3 text-sm font-semibold text-slate-900">Response time</div>
          <p className="text-sm text-slate-600">Usually within 2 business days.</p>
        </div>
      </div>

      <h2>Send a message</h2>
      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          Thanks! Your message has been queued. We'll get back to you at the
          email you provided.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="not-prose grid gap-3"
        >
          <input
            required
            type="text"
            placeholder="Your name"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <textarea
            required
            rows={5}
            placeholder="How can we help?"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Send className="h-4 w-4" /> Send message
          </button>
        </form>
      )}
    </PageShell>
  );
}