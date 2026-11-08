import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description: "Contactez Taloom pour parler de votre projet.",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">03 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section className="contact-shell">
        <div className="contact-panel info-card">
          <h2>{t("summaryTitle")}</h2>
          <p>{t("summaryText")}</p>
          <ul className="bullet-list">
            <li>{t("bulletOne")}</li>
            <li>{t("bulletTwo")}</li>
            <li>{t("bulletThree")}</li>
          </ul>
        </div>

        <div className="contact-panel info-card">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
