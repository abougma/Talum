import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EstimateWidget } from "@/components/estimate-widget";
import { PricingGrid } from "@/components/pricing-grid";

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

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">05 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <EstimateWidget />

      <PricingGrid />

      <section aria-label="Appel à l’action" className="cta-band">
        <h2>{t("cta")}</h2>
        <Link className="button button-primary" href="/contact">
          {t("contact")}
        </Link>
      </section>
    </main>
  );
}
