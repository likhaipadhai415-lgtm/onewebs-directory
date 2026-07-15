import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { categories } from "@/lib/onewebs-data";
import { Send, CheckCircle2, Upload, X, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const MAX_LOGO_BYTES = 400 * 1024; // 400KB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function SubmitPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
    description: "",
    pricing: "",
    submitter_email: "",
    relation: "fan",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = (f: File | null) => {
    setErr(null);
    if (!f) {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      setErr("Logo must be PNG, JPG, WebP, or SVG.");
      return;
    }
    if (f.size > MAX_LOGO_BYTES) {
      setErr("Logo must be under 400 KB. Please compress it.");
      return;
    }
    setLogoFile(f);
    fileToDataUrl(f).then(setLogoPreview).catch(() => setErr("Could not read the file."));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!logoFile || !logoPreview) {
      setErr("Please upload a website logo — it's required.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.from("submissions").insert({
        name: form.name.trim(),
        url: form.url.trim(),
        category: form.category,
        description: form.description.trim(),
        pricing: form.pricing,
        submitter_email: form.submitter_email.trim(),
        relation: form.relation,
        logo_url: logoPreview,
      });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setErr(e?.message ?? "Could not submit — please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <PageShell kicker="Submission received" title="Thanks — we'll take a look.">
        <div className="not-prose flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div>
            Your submission is now in the review queue. Our admin will approve or decline it —
            approved sites appear on OneWebs automatically. We may reply from{" "}
            <strong>likhaipadhai415@gmail.com</strong> if we need more info.
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      kicker="Submit"
      title="Add your website to OneWebs."
      intro="Free to submit, reviewed by a human. Please share a real, working product — logo required."
    >
      <form onSubmit={onSubmit} className="not-prose grid gap-4">
        <Field label="Website logo" required>
          <div className="flex items-start gap-4">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-2" />
              ) : (
                <Upload className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <input
                ref={fileRef}
                required
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
              />
              <p className="mt-2 text-[11px] text-slate-500">
                PNG / JPG / WebP / SVG · max 400 KB · square logo works best.
              </p>
              {logoFile && (
                <button
                  type="button"
                  onClick={() => {
                    onFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>
          </div>
        </Field>

        <Field label="Website name" required>
          <input required type="text" value={form.name} onChange={set("name")} placeholder="e.g. Notion" className={inputCls} />
        </Field>
        <Field label="Website URL" required>
          <input required type="url" value={form.url} onChange={set("url")} placeholder="https://example.com" className={inputCls} />
        </Field>
        <Field label="Category" required>
          <select required value={form.category} onChange={set("category")} className={inputCls}>
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
            value={form.description}
            onChange={set("description")}
            placeholder="One or two sentences — what does it do, who is it for?"
            className={inputCls}
          />
        </Field>
        <Field label="Pricing" required>
          <select required value={form.pricing} onChange={set("pricing")} className={inputCls}>
            <option value="" disabled>Select pricing</option>
            <option>Free</option>
            <option>Freemium</option>
            <option>Paid</option>
            <option>Free + Paid</option>
          </select>
        </Field>
        <Field label="Your email" required>
          <input required type="email" value={form.submitter_email} onChange={set("submitter_email")} placeholder="you@example.com" className={inputCls} />
        </Field>
        <Field label="Your relationship to this website">
          <select value={form.relation} onChange={set("relation")} className={inputCls}>
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

        {err && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {busy ? "Submitting…" : "Submit for review"}
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