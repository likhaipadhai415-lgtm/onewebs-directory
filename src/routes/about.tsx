import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const URL = "https://find-best-sites.lovable.app/about";
const TITLE = "About OneWebs — One Place. Every Website.";
const DESC = "OneWebs is a handpicked directory of the best websites across every category — AI tools, learning, productivity, shopping, entertainment and more.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      kicker="About Us"
      title="One place for every great website."
      intro="OneWebs is a curated directory of the internet's most useful sites — organized by category, ranked for relevance, and always free to browse."
    >
      <h2>Our mission</h2>
      <p>
        The web is full of incredible tools, but finding them shouldn't require a
        dozen Google searches. OneWebs collects the sites that people actually
        recommend and puts them in one clean, fast, searchable place.
      </p>
      <h2>What we cover</h2>
      <ul>
        <li>AI chatbots, image, video and voice tools</li>
        <li>Learning platforms and knowledge hubs</li>
        <li>Productivity, communication and cloud storage</li>
        <li>Design, developer, PDF and file utilities</li>
        <li>Shopping, entertainment, payments, health and travel</li>
      </ul>
      <h2>How sites get here</h2>
      <p>
        Every listing is reviewed by a human editor. We look for a real
        product, an active team, and value the community can trust. Anyone can{" "}
        <a href="/submit">submit a website</a> for consideration.
      </p>
      <h2>Not affiliated</h2>
      <p>
        We are an independent directory. All product names, logos and brands are
        property of their respective owners and their inclusion here does not
        imply an endorsement of OneWebs by them.
      </p>
    </PageShell>
  );
}