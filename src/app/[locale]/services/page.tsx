import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Services",
    description: "Expertises de Talum : développement, cloud, gestion de projet, IA et conseil.",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  const services = [
    {
      id: "developpement",
      title: "Développement web et applicatif",
      description:
        "Conception de l’interface, structuration de l’architecture, respect du périmètre fonctionnel et livrables maintenables. La solution est pensée pour évoluer sans perdre en lisibilité ni en fiabilité.",
    },
    {
      id: "cloud",
      title: "Cloud & DevOps",
      description:
        "Mise en place du socle technique, CI/CD, environnement de production, sécurité et supervision. Le but est d’obtenir une base stable, documentée et facile à faire évoluer.",
    },
    {
      id: "gestion",
      title: "Gestion de projet",
      description:
        "Cadrage, priorisation, coordination, suivi des tâches et communication régulière. La gestion de projet sert à sécuriser la décision, limiter le besoin de rework et rendre les avancées visibles.",
    },
    {
      id: "ia",
      title: "IA et automatisation",
      description:
        "Cartographie des besoins d’automatisation, workflows documentés, assistance IA et intégrations ciblées. Les usages sont définis pour gagner du temps sans introduire de dépendance fragile.",
    },
    {
      id: "conseil",
      title: "Conseil et audit technique",
      description:
        "Diagnostic du système existant, recommandations de structure, revue des risques et identification des choix à privilégier. L’objectif est de clarifier la bonne direction avant d’investir dans la mise en œuvre.",
    },
  ];

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">01 / SERVICES</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <section aria-label="Expertises" className="stack-list">
        {services.map(({ id, title, description }) => (
          <article className="info-card" id={id} key={id}>
            <p className="eyebrow">{id}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section aria-label="Appel à l’action" className="cta-band">
        <h2>{t("cta")}</h2>
        <Link className="button button-primary" href="/contact">
          {t("cta")}
        </Link>
      </section>
    </main>
  );
}
