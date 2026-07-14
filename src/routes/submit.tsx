import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { categories } from "@/lib/onewebs-data";
import { Send, CheckCircle2 } from "lucide-react";

const URL = "https://find-best-sites.lovable.app/submit";
const TITLE = "Submit a Website — OneWebs";
const DESC = "Know a great website that belongs on OneWebs? Submit it for review — it's free.";

export const Route = createFileRoute("/submit")({
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
  component: SubmitPage,
});

function SubmitPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <PageShell kicker="Submission received" title="Thanks — we'll take a look.">
        <div className="not-prose flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div>
            Our editors review every submission. If your site is a good fit,
            you'll usually see it live within a week. We may reach out from{" "}
            <strong>hello@onewebs.app</strong> if we need more info.
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      kicker="Submit"
      title="Add your website to OneWebs."
      intro="Free to submit, curated by humans, no strings attached. Please share a real, working product."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="not-prose grid gap-4"
      >
        <Field label="Website name" required>
          <input required type="text" placeholder="e.g. Notion" className={inputCls} />
        </Field>
        <Field label="Website URL" required>
          <input required type="url" placeholder="https://example.com" className={inputCls} />
        </Field>
        <Field label="Category" required>
          <select required className={inputCls} defaultValue="">
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Short description" required>
          <textarea
            required
            rows={3}
            maxLength={160}
            placeholder="One or two sentences — what does it do, who is it for?"
            className={inputCls}
          />
        </Field>
        <Field label="Pricing" required>
          <select required className={inputCls} defaultValue="">
            <option value="" disabled>Select pricing</option>
            <option>Free</option>
            <option>Freemium</option>
            <option>Paid</option>
            <option>Free + Paid</option>
          </select>
        </Field>
        <Field label="Your email" required>
          <input required type="email" placeholder="you@example.com" className={inputCls} />
        </Field>
        <Field label="Your relationship to this website">
          <select className={inputCls} defaultValue="fan">
            <option value="owner">I own or work on it</option>
            <option value="fan">I'm just a happy user</option>
          </select>
        </Field>

        <label className="flex items-start gap-2 text-xs text-slate-600">
          <input type="checkbox" required className="mt-0.5" />
          <span>
            I agree to the OneWebs{" "}
            <a href="/terms" className="text-blue-600 hover:underline">terms</a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a>.
          </span>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Send className="h-4 w-4" /> Submit for review
        </button>
      </form>
    </PageShell>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}