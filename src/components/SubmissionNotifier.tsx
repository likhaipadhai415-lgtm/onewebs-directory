import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Row = {
  id: string;
  name: string;
  status: "pending" | "approved" | "declined";
  submitter_email: string;
};

const SEEN_KEY = "onewebs.notifiedSubmissions";

function loadSeen(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function saveSeen(map: Record<string, string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function SubmissionNotifier() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const email = user?.email?.toLowerCase() ?? null;
  const seenRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!email) return;
    seenRef.current = loadSeen();

    const notify = (row: Row) => {
      if (row.submitter_email.toLowerCase() !== email) return;
      if (row.status === "pending") return;
      if (seenRef.current[row.id] === row.status) return;
      seenRef.current[row.id] = row.status;
      saveSeen(seenRef.current);

      qc.invalidateQueries({ queryKey: ["my-submissions"] });
      qc.invalidateQueries({ queryKey: ["approved-submissions"] });

      if (row.status === "approved") {
        toast.success(`"${row.name}" was approved 🎉`, {
          description: "It's now live on OneWebs — thanks for the submission!",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          duration: 8000,
          action: { label: "View", onClick: () => window.location.assign("/") },
        });
      } else if (row.status === "declined") {
        toast.error(`"${row.name}" was not accepted`, {
          description: "Feel free to submit a different site anytime.",
          icon: <XCircle className="h-4 w-4 text-rose-600" />,
          duration: 8000,
          action: { label: "Submit another", onClick: () => window.location.assign("/submit") },
        });
      }
    };

    const channel = supabase
      .channel(`submissions:${email}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "submissions" },
        (payload) => notify(payload.new as Row),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [email, qc]);

  return null;
}