import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

/** Replays lightweight text reveals whenever copy enters the viewport from either direction. */
export function ScrollTextReveal() {
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("ow-reveal-visible", entry.isIntersecting);
        }
      },
      { rootMargin: "-4% 0px -8% 0px", threshold: 0.01 },
    );

    const register = () => {
      document.querySelectorAll("main h1, main h2, main h3, main [data-scroll-reveal]").forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        observer.observe(element);
        // Text stays readable on SSR or with JavaScript disabled; only animate after observation starts.
        element.classList.add("ow-reveal-ready");
      });
    };

    register();
    const main = document.querySelector("main");
    const changes = new MutationObserver(register);
    if (main) changes.observe(main, { childList: true, subtree: true });

    return () => {
      changes.disconnect();
      observer.disconnect();
      document.querySelectorAll(".ow-reveal-ready").forEach((element) => {
        element.classList.remove("ow-reveal-ready", "ow-reveal-visible");
      });
    };
  }, [pathname]);

  return null;
}