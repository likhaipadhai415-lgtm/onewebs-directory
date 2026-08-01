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
      intro="This page describes what information OneWebs collects, how it's used, and the choices you have. Last updated July 17, 2026."
    >
      <h2>1. Who we are</h2>
      <p>
        OneWebs (&quot;we&quot;, &quot;us&quot;) operates the website directory
        available at find-best-sites.lovable.app. You can reach us at{" "}
        <a href="mailto:likhaipadhai415@gmail.com">likhaipadhai415@gmail.com</a>.
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
        <li>
          <strong>Account data</strong> — if you create an account to submit a
          website, we store your email address and an encrypted password hash.
          We never see or store your password in plain text.
        </li>
        <li>
          <strong>Submission records</strong> — the website name, URL,
          category, description and logo you upload, plus the review status
          (pending, approved or declined) and review date.
        </li>
        <li>
          <strong>Cookie consent record</strong> — the choice you made in the
          consent banner, its timestamp, the policy version and your browser
          user agent, stored locally for auditing.
        </li>
      </ul>

      <h2>3. How we use it</h2>
      <ul>
        <li>To operate, secure and improve the directory.</li>
        <li>To reply to messages and evaluate site submissions.</li>
        <li>
          To notify you in the app when your submission is approved or
          declined.
        </li>
        <li>To measure aggregate traffic — never to build a profile of you.</li>
      </ul>

      <h2>3b. Legal bases (GDPR)</h2>
      <ul>
        <li>
          <strong>Contract</strong> — processing your account and submissions
          so we can provide the service you asked for.
        </li>
        <li>
          <strong>Legitimate interests</strong> — security, abuse prevention
          and aggregate traffic measurement.
        </li>
        <li>
          <strong>Consent</strong> — any non-essential storage, which you can
          withdraw at any time from the cookie banner.
        </li>
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
      <p>
        Our hosting and database provider stores account and submission data on
        our behalf under a data-processing agreement. We do not sell, rent or
        trade personal data to anyone.
      </p>

      <h2>5b. Data retention</h2>
      <ul>
        <li>Request logs — up to 30 days.</li>
        <li>
          Declined submissions — up to 12 months, then deleted.
        </li>
        <li>
          Approved submissions — kept while the listing is live in the
          directory.
        </li>
        <li>
          Account data — kept until you ask us to delete your account.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        export, restrict or delete your personal data, and to object to
        processing. You can clear locally stored preferences at any time from
        your browser settings. For anything else, email{" "}
        <a href="mailto:likhaipadhai415@gmail.com">likhaipadhai415@gmail.com</a>{" "}
        and we'll respond within 30 days.
      </p>

      <h2>6b. Security</h2>
      <p>
        All traffic is served over HTTPS. Database access is protected by
        row-level security rules so you can only read your own submissions, and
        administrative review is limited to authorised accounts.
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

      <h2>9. Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:likhaipadhai415@gmail.com">likhaipadhai415@gmail.com</a>{" "}
        or use the <a href="/contact">contact page</a>.
      </p>
    </PageShell>
  );
}