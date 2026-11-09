"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PageAnimations({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const main = root.querySelector("main");
      const titleWords = root.querySelectorAll(".hero-title-word");
      const hero = root.querySelector(".hero");
      const proofPanel = root.querySelector(".proof-panel");
      const sections = gsap.utils.toArray<HTMLElement>(
        [
          "main > section:not(.hero):not(.scroll-story)",
          "main.content-page > .page-header",
          "main.content-page > section:not(.scroll-story)",
          "main.content-page > .projects-grid",
          "main.content-page > .case-header",
          "main.content-page > .case-body",
          "main .service-section",
        ].join(", "),
        root,
      );

      if (main) {
        gsap.from(main, {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power1.out",
        });
      }

      if (titleWords.length > 0) {
        gsap.from(titleWords, {
          autoAlpha: 0,
          yPercent: 110,
          rotate: 3,
          duration: 0.9,
          stagger: 0.055,
          ease: "power4.out",
          delay: 0.12,
        });
      }

      const heroCopyDetails = root.querySelectorAll(
        ".hero-copy > .eyebrow, .hero-copy > .lead, .hero-copy > .hero-actions",
      );
      if (heroCopyDetails.length > 0) {
        gsap.from(heroCopyDetails, {
          autoAlpha: 0,
          y: 22,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.28,
          ease: "power3.out",
        });
      }

      if (proofPanel) {
        gsap.from(proofPanel, {
          autoAlpha: 0,
          x: 48,
          rotateY: -8,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        });
      }

      if (hero && proofPanel) {
        gsap.to(proofPanel, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }

      sections.forEach((section) => {
        const items = section.querySelectorAll(
          ".section-heading, .page-header, .expertise-card, .featured-project, .method-steps > li, .path-card, .service-details > div, .info-card, .case-main > section",
        );
        const targets = items.length > 0 ? items : [section];

        gsap.from(targets, {
          autoAlpha: 0,
          y: 44,
          duration: 0.85,
          stagger: items.length > 0 ? 0.1 : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div className="page-animations" ref={rootRef}>
      {children}
    </div>
  );
}
