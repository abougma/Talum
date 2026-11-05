import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "À propos",
    description: "Parcours, valeurs et méthode de travail de Talum.",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const values = t.raw("values") as string[];
  const zones = t.raw("zones") as string[];

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">02 / À PROPOS</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section className="story-block">
        <div>
          <h2>{t("methodTitle")}</h2>
          <p>{t("methodText")}</p>
        </div>
        <p>{t("story")}</p>
      </section>

      <section className="info-card">
        <h2>Un accompagnement orienté résultats</h2>
        <p>
          Talum accompagne les organisations qui veulent une solution utile, claire et fiable sans
          s’enliser dans des montées en complexité inutiles. Le travail se construit autour d’un
          cadrage simple, de décisions explicites et de livrables qui servent réellement le besoin.
        </p>
      </section>

      <section className="split-grid" aria-label="Valeurs et zones">
        <div className="info-card">
          <h2>{t("valuesTitle")}</h2>
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

      <section className="cta-band" aria-label="Contact">
        <h2>Parler de mon projet</h2>
        <Link className="button button-primary" href="/contact">
          Parler de mon projet
        </Link>
      </section>
    </main>
  );
}
