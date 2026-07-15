import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Website, Pricing } from "@/lib/onewebs-data";

export type ApprovedSubmission = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
  logo_url: string;
  popular: boolean;
  is_new: boolean;
  created_at: string;
};

function toWebsite(row: ApprovedSubmission): Website {
  let domain = "";
  try {
    domain = new URL(row.url).hostname.replace(/^www\./, "");
  } catch {
    domain = row.url;
  }
  const pricing = (["Free", "Paid", "Freemium", "Free + Paid"].includes(row.pricing)
    ? row.pricing
    : "Free") as Pricing;
  return {
    name: row.name,
    url: row.url,
    domain,
    description: row.description,
    category: row.category,
    pricing,
    official: false,
    popular: row.popular,
    isNew: row.is_new,
    logoUrl: row.logo_url,
  };
}

export function useApprovedSites() {
  return useQuery({
    queryKey: ["approved-submissions"],
    queryFn: async (): Promise<Website[]> => {
      const { data, error } = await supabase
        .from("submissions")
        .select("id,name,url,category,description,pricing,logo_url,popular,is_new,created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => toWebsite(r as ApprovedSubmission));
    },
    staleTime: 60_000,
  });
}