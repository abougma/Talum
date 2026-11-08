import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const values = t.raw("values") as string[];
  const zones = t.raw("zones") as string[];
  const methodSteps = t.raw("methodSteps") as { title: string; text: string }[];

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">02 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section className="founder-block">
        <div className="founder-card">
          <Image
            alt={t("founderPhotoAlt")}
            className="founder-photo"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 40vw"
            src="/armel-bougma.png"
          />
          <div className="founder-card-content">
            <p className="eyebrow">{t("founderLabel")}</p>
            <p className="founder-name">{t("founderName")}</p>
            <p className="founder-role">{t("founderRole")}</p>
          </div>
        </div>
        <div className="founder-story">
          <h2>{t("storyTitle")}</h2>
          <p>{t("story")}</p>
          <p>{t("storySecond")}</p>
        </div>
      </section>

      <section aria-labelledby="values-title" className="split-grid">
        <div className="info-card">
          <h2 id="values-title">{t("valuesTitle")}</h2>
          <ul className="bullet-list">
            {values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>

        <div className="info-card">
          <h2>{t("zonesTitle")}</h2>
          <ul className="bullet-list">
            {zones.map((zone) => (
              <li key={zone}>{zone}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="about-method-title" className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / {t("methodLabel")}</p>
            <h2 id="about-method-title">{t("methodTitle")}</h2>
          </div>
          <p className="section-intro">{t("methodIntro")}</p>
        </div>
        <ol className="method-steps">
          {methodSteps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="certifications-title" className="info-card placeholder-card">
        <h2 id="certifications-title">{t("certificationsTitle")}</h2>
        <p>{t("certificationsText")}</p>
        <p className="placeholder">[À COMPLÉTER]</p>
      </section>

      <section className="cta-band" aria-label={t("ctaLabel")}>
        <h2>{t("cta")}</h2>
        <div className="cta-actions">
          <Link className="button button-primary" href="/contact">
            {t("contactCta")}
          </Link>
          <Link className="button button-secondary" href="/realisations">
            {t("projectsCta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
