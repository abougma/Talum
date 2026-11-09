"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrollStoryVisual, type ScrollStoryVariant } from "@/components/scroll-story-visual";

export type ScrollStoryStep = {
  title: string;
  text?: string;
  points?: string[];
  meta?: string;
  href?: string;
  linkLabel?: string;
};

type Props = {
  className?: string;
  eyebrow: string;
  id: string;
  intro?: string;
  steps: ScrollStoryStep[];
  title: string;
  variant: ScrollStoryVariant;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StepLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("#")) {
    return (
      <a className="text-link" href={href}>
        {label}
      </a>
    );
  }

  return (
    <Link className="text-link" href={href}>
      {label}
    </Link>
  );
}

export function ScrollStory({ className, eyebrow, id, intro, steps, title, variant }: Props) {
  const t = useTranslations("ScrollStories");
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLOListElement>(null);
  const active = steps[activeStep] ?? steps[0];
  const total = String(steps.length).padStart(2, "0");

  useEffect(() => {
    const list = stepsRef.current;

    if (!list) {
      return;
    }

    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-scroll-step]"));

    if (items.length === 0) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const midpoint = window.innerHeight / 2;
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemDistance = Math.abs(rect.top + rect.height / 2 - midpoint);

        if (itemDistance < distance) {
          distance = itemDistance;
          closest = index;
        }
      });

      setActiveStep((current) => (current === closest ? current : closest));
    };

    const schedule = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const observer = new IntersectionObserver(schedule, {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    });

    items.forEach((item) => observer.observe(item));
    update();
    window.addEventListener("resize", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section aria-labelledby={`${id}-title`} className={classes("scroll-story", className)} id={id}>
      <header className="scroll-story-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </header>

      <div className="scroll-story-layout">
        <div aria-hidden="true" className="scroll-story-visual">
          <ScrollStoryVisual activeStep={activeStep} variant={variant} />

          <div className="scroll-story-visual-caption">
            <span className="scroll-story-visual-index">
              {String(activeStep + 1).padStart(2, "0")} / {total}
            </span>
            <span className="scroll-story-visual-title">{active?.title}</span>
          </div>

          <ol className="scroll-story-rail">
            {steps.map((step, index) => (
              <li
                className={classes(
                  index === activeStep && "is-active",
                  index < activeStep && "is-done",
                )}
                key={`${step.title}-${index}`}
              />
            ))}
          </ol>
        </div>

        <ol aria-label={t("progressLabel")} className="scroll-story-steps" ref={stepsRef}>
          {steps.map((step, index) => (
            <li
              className={classes(
                "scroll-story-step",
                index === activeStep && "is-active",
                index < activeStep && "is-done",
              )}
              data-scroll-step
              key={`${step.title}-${index}`}
            >
              <p className="eyebrow scroll-story-step-index">
                {String(index + 1).padStart(2, "0")} / {total}
              </p>
              <h3>{step.title}</h3>
              {step.meta ? <p className="scroll-story-step-meta">{step.meta}</p> : null}
              {step.text ? <p className="scroll-story-step-text">{step.text}</p> : null}
              {step.points && step.points.length > 0 ? (
                <ul className="scroll-story-points">
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {step.href && step.linkLabel ? (
                <StepLink href={step.href} label={step.linkLabel} />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
