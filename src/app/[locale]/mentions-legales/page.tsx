import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mentions légales",
    description: "Mentions légales de Taloom et informations de contact administratives.",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "LegalPage" });

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">06 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section className="info-card legal-card">
        <h2>{t("identityTitle")}</h2>
        <p>{t("identityText")}</p>
      </section>

      <section className="split-grid">
        <article className="info-card">
          <h2>{t("contactTitle")}</h2>
          <p>{t("contactText")}</p>
        </article>
        <article className="info-card">
          <h2>{t("responsibilityTitle")}</h2>
          <p>{t("responsibilityText")}</p>
        </article>
      </section>
    </main>
  );
}
