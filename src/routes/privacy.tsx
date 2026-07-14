import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const URL = "https://find-best-sites.lovable.app/privacy";
const TITLE = "Privacy Policy — OneWebs";
const DESC = "How OneWebs handles the very little personal data it processes when you browse the directory.";

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      kicker="Legal"
      title="Privacy Policy"
      intro="This page describes what information OneWebs collects, how it's used, and the choices you have. Last updated July 14, 2026."
    >
      <h2>1. Who we are</h2>
      <p>
        OneWebs (&quot;we&quot;, &quot;us&quot;) operates the website directory
        available at find-best-sites.lovable.app. You can reach us at{" "}
        <a href="mailto:hello@onewebs.app">hello@onewebs.app</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>
        OneWebs is a public directory. You can browse without an account. We
        collect only what is needed to run the service:
      </p>
      <ul>
        <li>
          <strong>Locally stored preferences</strong> — favorites, recently
          viewed and theme choice, saved in your browser's localStorage. This
          data never leaves your device.
        </li>
        <li>
          <strong>Basic request logs</strong> — IP address, user agent and page
          requested, retained for up to 30 days for security and abuse
          prevention.
        </li>
        <li>
          <strong>Contact and submission forms</strong> — if you email us or
          submit a site, we store the details you provide so we can respond.
        </li>
      </ul>

      <h2>3. How we use it</h2>
      <ul>
        <li>To operate, secure and improve the directory.</li>
        <li>To reply to messages and evaluate site submissions.</li>
        <li>To measure aggregate traffic — never to build a profile of you.</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        OneWebs uses essential first-party storage only. See our{" "}
        <a href="/cookies">Cookie Policy</a> for the full list.
      </p>

      <h2>5. Third parties</h2>
      <p>
        Website logos are loaded through Google's public favicon service. When
        you click <em>Open Website</em>, you're taken directly to the third
        party's own site, which is governed by their privacy policy — not ours.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You can clear locally stored preferences at any time from your browser
        settings. For access, correction or deletion of anything you sent us,
        email <a href="mailto:hello@onewebs.app">hello@onewebs.app</a>.
      </p>

      <h2>7. Children</h2>
      <p>
        OneWebs is not directed to children under 13 and we do not knowingly
        collect their personal data.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this policy from time to time. Material changes will be
        highlighted on this page with a new &quot;last updated&quot; date.
      </p>
    </PageShell>
  );
}