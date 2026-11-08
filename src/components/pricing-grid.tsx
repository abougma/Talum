"use client";

import { useLocale, useTranslations } from "next-intl";
import { pricingConfig, pricingServiceOrder } from "@/lib/pricing/config";

/**
 * Grille tarifaire publique, pilotée par la configuration.
 * Aucun prix n’est écrit dans ce composant.
 */
export function PricingGrid() {
  const t = useTranslations("EstimatePage");
  const tp = useTranslations("EstimatePricing");
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: pricingConfig.currency,
    maximumFractionDigits: 0,
  });

  return (
    <section aria-labelledby="pricing-grid-title" className="pricing-section">
      <div className="section-heading">
        <p className="eyebrow">{t("gridEyebrow")}</p>
        <h2 id="pricing-grid-title">{t("gridTitle")}</h2>
        <p className="section-intro">{t("gridIntro")}</p>
      </div>

      <div className="pricing-table-wrap">
        <table className="pricing-table">
          <caption className="visually-hidden">{t("gridCaption")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("gridService")}</th>
              <th scope="col">{t("gridDailyRate")}</th>
              <th scope="col">{t("gridBaseDays")}</th>
            </tr>
          </thead>
          <tbody>
            {pricingServiceOrder.map((serviceId) => {
              const service = pricingConfig.services[serviceId];

              return (
                <tr key={serviceId} className={serviceId === "ia" ? "pricing-row-ai" : undefined}>
                  <th scope="row">
                    {tp(service.labelKey.replace("EstimatePricing.", ""))}
                  </th>
                  <td>
                    {service.dailyRate === null
                      ? t("gridOnRequest")
                      : formatter.format(service.dailyRate)}
                  </td>
                  <td>
                    {service.baseDays === null
                      ? "—"
                      : t("gridDayUnit", { days: service.baseDays })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="section-note">{t("gridNote")}</p>
      <p className="section-note">{t("aiNote")}</p>
      <p className="section-note">{t("gridVersion", { version: pricingConfig.version })}</p>
    </section>
  );
}
