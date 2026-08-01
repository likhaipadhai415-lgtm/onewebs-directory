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
      intro="OneWebs uses only what's needed to remember your preferences on your own device. Last updated July 17, 2026."
    >
      <h2>1. What are cookies and local storage?</h2>
      <p>
        Cookies are small text files a site can save in your browser. Local
        storage works the same way but stays on your device and is never sent
        with network requests. OneWebs relies almost entirely on local storage
        rather than cookies.
      </p>

      <h2>2. Essential storage</h2>
      <p>
        These are strictly necessary for the site to work and cannot be turned
        off.
      </p>
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
        <li>
          <strong>onewebs.cookieConsent</strong> — your banner choice, the ISO
          timestamp, epoch time, policy version and browser user agent, kept as
          an audit record of your consent.
        </li>
        <li>
          <strong>Session token</strong> — set only if you sign in to submit a
          website, so you stay logged in between visits.
        </li>
      </ul>

      <h2>3. Optional storage</h2>
      <p>
        If you choose <em>Only essential</em> in the consent banner, nothing
        beyond the list above is stored. Choosing <em>Accept all</em>
        additionally allows anonymous usage measurement to help us improve the
        directory. You can change your mind at any time by clearing site data
        and reloading the page — the banner will appear again.
      </p>

      <h2>4. Analytics</h2>
      <p>
        Aggregate page-view counts are collected server-side without setting
        third-party tracking cookies. We do not use advertising, retargeting or
        cross-site tracking cookies of any kind.
      </p>

      <h2>5. Third-party content</h2>
      <p>
        Website logos in the directory are loaded from Google's public favicon
        service. When you click <em>Open Website</em>, you leave OneWebs and
        the destination site's own cookie policy applies.
      </p>

      <h2>6. Managing storage</h2>
      <p>
        Clearing site data from your browser removes every value listed above.
        Doing so will reset your favorites and recently viewed list.
      </p>
      <p>
        Most browsers also let you block cookies and storage per site under
        Settings → Privacy. Blocking essential storage may stop favorites and
        sign-in from working.
      </p>

      <h2>7. Changes and contact</h2>
      <p>
        We'll update this page and the &quot;last updated&quot; date whenever
        our use of storage changes. See also our{" "}
        <a href="/privacy">Privacy Policy</a>, or email{" "}
        <a href="mailto:likhaipadhai415@gmail.com">likhaipadhai415@gmail.com</a>
        .
      </p>
    </PageShell>
  );
}