import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";
import { PageShell } from "@/components/PageShell";
import { Check, X, ExternalLink, LogOut, ShieldAlert, Loader2 } from "lucide-react";

type SubmissionRow = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
  logo_url: string;
  submitter_email: string;
  relation: string | null;
  status: "pending" | "approved" | "declined";
  created_at: string;
};

type Tab = "pending" | "approved" | "declined";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Website Submissions" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("pending");
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" }).catch(() => {});
    }
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["submissions", tab],
    queryFn: async (): Promise<SubmissionRow[]> => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("status", tab)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SubmissionRow[];
    },
    enabled: !!user && isAdmin === true,
  });

  // Realtime updates
  useEffect(() => {
    if (!user || !isAdmin) return;
    const channel = supabase
      .channel("submissions-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        () => {
          qc.invalidateQueries({ queryKey: ["submissions"] });
          qc.invalidateQueries({ queryKey: ["approved-submissions"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, qc]);

  const decide = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "declined" }) => {
      const { error } = await supabase
        .from("submissions")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user!.id,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      qc.invalidateQueries({ queryKey: ["approved-submissions"] });
    },
  });

  const counts = useMemo(() => ({ ...({} as Record<Tab, number | undefined>) }), []);

  if (loading || isAdmin === null) {
    return (
      <PageShell kicker="Admin" title="Loading…">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking access…
        </div>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell kicker="Admin" title="Access denied.">
        <div className="not-prose flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <ShieldAlert className="mt-0.5 h-5 w-5" />
          <div>
            You're signed in as <strong>{user?.email}</strong>, but this account isn't an admin.
            <div className="mt-2">
              Only <strong>likhaipadhai415@gmail.com</strong> is set as the admin. Sign in with that email to review submissions.
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/auth" });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
              <Link to="/" className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                Go home
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      kicker="Admin"
      title="Review website submissions."
      intro="Approve to publish on OneWebs, or decline to hide."
    >
      <div className="not-prose mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["pending", "approved", "declined"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="not-prose rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          No {tab} submissions.
        </div>
      ) : (
        <div className="not-prose grid gap-3">
          {data!.map((s) => (
            <SubmissionCard
              key={s.id}
              s={s}
              onApprove={() => decide.mutate({ id: s.id, status: "approved" })}
              onDecline={() => decide.mutate({ id: s.id, status: "declined" })}
              busy={decide.isPending}
              tab={tab}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function SubmissionCard({
  s, onApprove, onDecline, busy, tab,
}: {
  s: SubmissionRow;
  onApprove: () => void;
  onDecline: () => void;
  busy: boolean;
  tab: Tab;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-4">
        <img
          src={s.logo_url}
          alt={`${s.name} logo`}
          className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-semibold text-slate-900">{s.name}</div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {s.category}
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              {s.pricing}
            </span>
          </div>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            {s.url} <ExternalLink className="h-3 w-3" />
          </a>
          <p className="mt-2 text-sm text-slate-700">{s.description}</p>
          <div className="mt-2 text-xs text-slate-500">
            Submitted by <strong>{s.submitter_email}</strong>
            {s.relation && <> · {s.relation === "owner" ? "Owner/works on it" : "Just a user"}</>}
            {" · "}{new Date(s.created_at).toLocaleString()}
          </div>
        </div>
        {tab === "pending" && (
          <div className="flex shrink-0 flex-col gap-2">
            <button
              onClick={onApprove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button
              onClick={onDecline}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
            >
              <X className="h-3.5 w-3.5" /> Decline
            </button>
          </div>
        )}
        {tab === "approved" && (
          <button
            onClick={onDecline}
            disabled={busy}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" /> Unpublish
          </button>
        )}
        {tab === "declined" && (
          <button
            onClick={onApprove}
            disabled={busy}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </button>
        )}
      </div>
    </div>
  );
}