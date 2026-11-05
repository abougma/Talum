"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";

const projectOptions = {
  site: { base: 2600 },
  app: { base: 4200 },
  platform: { base: 6300 },
} as const;

type ProjectKey = keyof typeof projectOptions;

export function EstimateWidget() {
  const t = useTranslations("EstimatePage");
  const locale = useLocale();
  const [projectType, setProjectType] = useState<ProjectKey>("site");
  const [scope, setScope] = useState(2);
  const [urgency, setUrgency] = useState(1);
  const [aiAutomation, setAiAutomation] = useState(false);
  const [opsSetup, setOpsSetup] = useState(false);

  const estimate = useMemo(() => {
    const base = projectOptions[projectType].base;
    const scopeFactors = [1, 1.35, 1.8, 2.4];
    const urgencyFactors = [1, 1.15, 1.35];
    const addOns = (aiAutomation ? 1300 : 0) + (opsSetup ? 950 : 0);
    const value = Math.round((base * scopeFactors[scope] * urgencyFactors[urgency] + addOns) / 50) * 50;
    const minimum = Math.round((value * 0.85) / 50) * 50;
    const maximum = Math.round((value * 1.15) / 50) * 50;
    const schedule = ["2-4 semaines", "4-6 semaines", "6-10 semaines", "10-14 semaines"][scope];

    return {
      value,
      minimum,
      maximum,
      schedule,
    };
  }, [aiAutomation, opsSetup, projectType, scope, urgency]);

  const numberFormatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US");

  return (
    <section className="estimate-panel">
      <div className="estimate-grid">
        <div className="estimate-form">
          <div className="estimate-card">
            <h2>{t("projectType")}</h2>
            <div className="toggle-grid">
              {Object.entries(projectOptions).map(([key, option]) => {
                const typedKey = key as ProjectKey;
                const isSelected = projectType === typedKey;

                return (
                  <button
                    key={key}
                    className={isSelected ? "option-button is-selected" : "option-button"}
                    onClick={() => setProjectType(typedKey)}
                    type="button"
                  >
                    <span>{t(`types.${key}`)}</span>
                    <small>{numberFormatter.format(option.base)} €</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="estimate-card">
            <div className="range-header">
              <h2>{t("scope")}</h2>
              <span>{t(`scopeLevels.${scope}`)}</span>
            </div>
            <input
              aria-label={t("scope")}
              max={3}
              min={0}
              onChange={(event) => setScope(Number(event.target.value))}
              step={1}
              type="range"
              value={scope}
            />
            <div className="range-scale">
              <span>{t("scopeLevels.0")}</span>
              <span>{t("scopeLevels.3")}</span>
            </div>
          </div>

          <div className="estimate-card">
            <div className="range-header">
              <h2>{t("urgency")}</h2>
              <span>{t(`urgencyLevels.${urgency}`)}</span>
            </div>
            <input
              aria-label={t("urgency")}
              max={2}
              min={0}
              onChange={(event) => setUrgency(Number(event.target.value))}
              step={1}
              type="range"
              value={urgency}
            />
            <div className="range-scale">
              <span>{t("urgencyLevels.0")}</span>
              <span>{t("urgencyLevels.2")}</span>
            </div>
          </div>

          <div className="estimate-card">
            <h2>{t("addOns")}</h2>
            <label className="check-row">
              <input checked={aiAutomation} onChange={() => setAiAutomation((current) => !current)} type="checkbox" />
              <span>{t("aiAutomation")}</span>
            </label>
            <label className="check-row">
              <input checked={opsSetup} onChange={() => setOpsSetup((current) => !current)} type="checkbox" />
              <span>{t("opsSetup")}</span>
            </label>
          </div>
        </div>

        <aside className="estimate-summary">
          <p className="eyebrow">{t("summaryTitle")}</p>
          <div className="estimate-price">{numberFormatter.format(estimate.value)} €</div>
          <p className="estimate-range">
            {t("range", { min: numberFormatter.format(estimate.minimum), max: numberFormatter.format(estimate.maximum) })}
          </p>
          <ul className="bullet-list">
            <li>{t("deliverableOne")}</li>
            <li>{t("deliverableTwo")}</li>
            <li>{t("delivery", { schedule: estimate.schedule })}</li>
          </ul>
          <Link className="button button-primary" href="/contact">
            {t("contact")}
          </Link>
        </aside>
      </div>
    </section>
  );
}
