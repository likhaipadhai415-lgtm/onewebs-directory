import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const URL = "https://find-best-sites.lovable.app/terms";
const TITLE = "Terms & Conditions — OneWebs";
const DESC = "The terms that apply when you use OneWebs to discover and open third-party websites.";

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      kicker="Legal"
      title="Terms & Conditions"
      intro="By using OneWebs you agree to these terms. Last updated July 14, 2026."
    >
      <h2>1. What OneWebs is</h2>
      <p>
        OneWebs is a directory of third-party websites. We do not host, mirror
        or proxy the sites we list — clicking a listing opens the official
        website in a new tab.
      </p>

      <h2>2. Acceptable use</h2>
      <ul>
        <li>Don't scrape the directory or attempt to disrupt the service.</li>
        <li>Don't submit sites that are illegal, malicious or infringing.</li>
        <li>Don't misrepresent your relationship to a site you submit.</li>
      </ul>

      <h2>3. Third-party sites</h2>
      <p>
        OneWebs does not control the websites we link to. Their content,
        pricing, availability and privacy practices are their own. Your use of
        those sites is governed by their terms, not ours.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The OneWebs name, logo and directory layout are our property. Third-
        party names, logos and screenshots remain the property of their
        respective owners and are shown for identification only.
      </p>

      <h2>5. Disclaimer</h2>
      <p>
        OneWebs is provided &quot;as is&quot; without warranties of any kind.
        See our <a href="/disclaimer">Disclaimer</a> for details.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, OneWebs is not liable for any
        indirect, incidental or consequential damages arising from your use of
        the service or of any linked website.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update these terms. Continued use after an update means you
        accept the revised terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these terms?{" "}
        <a href="mailto:hello@onewebs.app">hello@onewebs.app</a>.
      </p>
    </PageShell>
  );
}