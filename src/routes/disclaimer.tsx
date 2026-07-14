import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const URL = "https://find-best-sites.lovable.app/disclaimer";
const TITLE = "Disclaimer — OneWebs";
const DESC = "OneWebs is an independent directory. Everything you see comes with the disclaimers below.";

export const Route = createFileRoute("/disclaimer")({
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
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <PageShell
      kicker="Legal"
      title="Disclaimer"
      intro="Please read this before relying on any information on OneWebs."
    >
      <h2>No professional advice</h2>
      <p>
        Listings and descriptions on OneWebs are for general informational
        purposes only and do not constitute professional, legal, financial or
        medical advice.
      </p>
      <h2>No endorsement</h2>
      <p>
        Inclusion of a website is not an endorsement. We are not paid to list
        sites and we don't guarantee that any listed site will meet your needs,
        remain available, or be free of bugs or malicious behaviour.
      </p>
      <h2>External links</h2>
      <p>
        Every &quot;Open Website&quot; button leaves OneWebs and takes you to a
        third-party site. What happens on that site — including pricing,
        content and privacy practices — is between you and that third party.
      </p>
      <h2>Trademarks</h2>
      <p>
        All product names, logos and brands are property of their respective
        owners. Their use on OneWebs is for identification purposes only.
      </p>
    </PageShell>
  );
}