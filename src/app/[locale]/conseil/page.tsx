import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdvisorWizard } from "@/components/advisor-wizard";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdvisorPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AdvisorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "AdvisorPage" });

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">05 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <AdvisorWizard />

      <section aria-label={t("bottomTitle")} className="cta-band">
        <div>
          <h2>{t("bottomTitle")}</h2>
          <p className="section-intro">{t("bottomText")}</p>
        </div>
        <Link className="button button-primary" href="/contact">
          {t("bottomCta")}
        </Link>
      </section>
    </main>
  );
}
