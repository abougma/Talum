import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Confidentialité",
    description: "Politique de confidentialité de Talum et traitement des données soumises via le site.",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">07 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section className="split-grid">
        <article className="info-card">
          <h2>{t("dataTitle")}</h2>
          <p>{t("dataText")}</p>
        </article>
        <article className="info-card">
          <h2>{t("usageTitle")}</h2>
          <p>{t("usageText")}</p>
        </article>
      </section>

      <section className="info-card legal-card">
        <h2>{t("rightsTitle")}</h2>
        <p>{t("rightsText")}</p>
      </section>
    </main>
  );
}
