import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pricingConfig } from "@/lib/pricing/config";
import { computeEstimate } from "@/lib/pricing/engine";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "EstimatePage" });

  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function EstimatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "EstimatePage" });
  const steps = t.raw("steps") as { title: string; text: string }[];
  const includedItems = t.raw("includedItems") as string[];
  const duration = computeEstimate(pricingConfig, {
    service: "web",
    features: [],
    constraints: [],
    complexity: "standard",
    urgency: "standard",
  }).durationWeeks;

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">05 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section aria-labelledby="quote-process-title" className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("processEyebrow")}</p>
            <h2 id="quote-process-title">{t("processTitle")}</h2>
          </div>
          <p className="section-intro">{t("processIntro")}</p>
        </div>
        <ol className="method-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="quote-included-title" className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("includedEyebrow")}</p>
            <h2 id="quote-included-title">{t("includedTitle")}</h2>
          </div>
          <p className="section-intro">{t("includedIntro")}</p>
        </div>
        <div className="split-grid">
          <div>
            <ul className="bullet-list">
              {includedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="section-note">{t("includedNote")}</p>
          </div>
          <aside className="info-card">
            <p className="eyebrow">{t("durationEyebrow")}</p>
            <h3>{t("durationTitle")}</h3>
            {duration ? (
              <>
                <p className="quote-duration">
                  {duration.min === duration.max
                    ? t("durationSingle", { weeks: duration.min })
                    : t("durationRange", { min: duration.min, max: duration.max })}
                </p>
                <p className="section-note">{t("durationNote")}</p>
              </>
            ) : (
              <p className="section-note">{t("durationPending")}</p>
            )}
          </aside>
        </div>
      </section>

      <section aria-label={t("cta")} className="cta-band">
        <h2>{t("cta")}</h2>
        <Link className="button button-primary" href="/contact">
          {t("contact")}
        </Link>
      </section>
    </main>
  );
}
