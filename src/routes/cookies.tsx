import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const URL = "https://find-best-sites.lovable.app/cookies";
const TITLE = "Cookie Policy — OneWebs";
const DESC = "Which cookies and browser storage OneWebs uses, and why.";

export const Route = createFileRoute("/cookies")({
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
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <PageShell
      kicker="Legal"
      title="Cookie Policy"
      intro="OneWebs uses only what's needed to remember your preferences on your own device."
    >
      <h2>Essential storage</h2>
      <ul>
        <li>
          <strong>onewebs.favorites</strong> — the list of sites you've
          hearted, kept in localStorage on your device.
        </li>
        <li>
          <strong>onewebs.recent</strong> — up to 20 recently opened sites, for
          the &quot;Recently Viewed&quot; list.
        </li>
        <li>
          <strong>onewebs.theme</strong> — your light/dark preference.
        </li>
      </ul>

      <h2>Analytics</h2>
      <p>
        Aggregate page-view counts are collected server-side without setting
        third-party tracking cookies.
      </p>

      <h2>Managing storage</h2>
      <p>
        Clearing site data from your browser removes every value listed above.
        Doing so will reset your favorites and recently viewed list.
      </p>
    </PageShell>
  );
}