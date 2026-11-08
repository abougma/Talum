"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { pricingConfig } from "@/lib/pricing/config";
import { computeEstimate } from "@/lib/pricing/engine";

/**
 * Consommateur minimal du moteur de calcul.
 *
 * - `pending-config` : aucune valeur HT complète, aucun prix affiché.
 * - `ready-ht` : grille HT complète mais TVA non validée. On affiche le HT et
 *   la fourchette HT, jamais la TVA ni le TTC.
 * - `ready` : TVA configurée, TTC disponible.
 *
 * Le parcours complet en étapes et le PDF restent en phase 6.
 */
export function EstimateWidget() {
  const t = useTranslations("EstimatePage");
  const locale = useLocale();
  const estimate = useMemo(
    () =>
      computeEstimate(pricingConfig, {
        service: "web",
        features: [],
        constraints: [],
        complexity: "standard",
        urgency: "standard",
      }),
    [],
  );

  if (estimate.status === "pending-config") {
    return (
      <section aria-labelledby="estimate-pending-title" className="estimate-panel">
        <div className="estimate-grid">
          <div className="estimate-card estimate-pending">
            <p className="eyebrow">{t("pendingLabel")}</p>
            <h2 id="estimate-pending-title">{t("pendingTitle")}</h2>
            <p>{t("pendingText")}</p>
            <ul className="bullet-list">
              <li>{t("pendingItemOne")}</li>
              <li>{t("pendingItemTwo")}</li>
              <li>{t("pendingItemThree")}</li>
            </ul>
            <Link className="button button-primary" href="/contact">
              {t("contact")}
            </Link>
          </div>

          <aside className="estimate-summary">
            <p className="eyebrow">{t("pendingSummaryTitle")}</p>
            <p>{t("pendingSummaryText")}</p>
            <p className="section-note">{t("pendingNote")}</p>
          </aside>
        </div>
      </section>
    );
  }

  const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: estimate.currency,
    maximumFractionDigits: 0,
  });
  const formatMoney = (value: number | null) => (value === null ? "—" : formatter.format(value));
  const duration = estimate.durationWeeks;
  const vatPending = estimate.status === "ready-ht";

  return (
    <section aria-labelledby="estimate-ready-title" className="estimate-panel">
      <div className="estimate-grid">
        <div className="estimate-card">
          <p className="eyebrow">{t("exampleLabel")}</p>
          <h2 id="estimate-ready-title">{t("readyTitle")}</h2>
          <p>{vatPending ? t("proposalText") : t("readyText")}</p>
          <p className="section-note">{t("exampleNote")}</p>
        </div>

        <aside className="estimate-summary">
          <p className="eyebrow">{t("summaryTitle")}</p>
          <div className="estimate-price">
            {formatMoney(estimate.totalHT)}
            <span className="estimate-price-unit">{t("htLabel")}</span>
          </div>
          <p className="estimate-range">
            {t("range", {
              min: formatMoney(estimate.rangeHT?.min ?? null),
              max: formatMoney(estimate.rangeHT?.max ?? null),
            })}
          </p>
          <dl className="metric">
            <dt>{t("vatLabel")}</dt>
            <dd>{vatPending ? t("vatPending") : formatMoney(estimate.vat.amount)}</dd>
            {!vatPending && (
              <>
                <dt>{t("totalTtcLabel")}</dt>
                <dd>{formatMoney(estimate.totalTTC)}</dd>
              </>
            )}
            <dt>{t("durationLabel")}</dt>
            <dd>
              {duration
                ? duration.min === duration.max
                  ? t("weeksSingle", { weeks: duration.min })
                  : t("weeks", { min: duration.min, max: duration.max })
                : "—"}
            </dd>
          </dl>
          {vatPending && <p className="section-note">{t("htOnlyNote")}</p>}
          <Link className="button button-primary" href="/contact">
            {t("contact")}
          </Link>
        </aside>
      </div>
    </section>
  );
}
