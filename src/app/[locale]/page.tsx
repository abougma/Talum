import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScrollStory } from "@/components/scroll-story";
import { getFeaturedProjects } from "@/data/projects";
import { getServices } from "@/data/services";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "HomePage" });
  const tNavigation = await getTranslations({ locale, namespace: "Navigation" });
  const services = getServices(locale);
  const featuredProjects = getFeaturedProjects(locale);
  const methodSteps = t.raw("methodSteps") as { title: string; text: string }[];
  const proofProject = featuredProjects.find((project) => project.slug === "gestilok");

  return (
    <main id="main">
      <section aria-labelledby="home-title" className="hero page-container">
        <div className="hero-copy">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 aria-label={t("title")} id="home-title">
            {t("title")
              .split(" ")
              .map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span aria-hidden="true" className="hero-title-word">
                    {word}
                  </span>{" "}
                </span>
              ))}
          </h1>
          <p className="lead">{t("intro")}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/estimate">
              {t("estimateCta")}
            </Link>
            <Link className="button button-secondary" href="/realisations">
              {t("projectsCta")}
            </Link>
          </div>
        </div>
        <aside aria-label={t("proofLabel")} className="proof-panel">
          <div aria-hidden="true" className="product-preview">
            <div className="product-browser-bar">
              <span />
              <span />
              <span />
              <span className="product-browser-address">gestilok.com</span>
            </div>
            <div className="product-app">
              <div className="product-app-header">
                <span className="product-brand">
                  <span className="product-brand-mark">g</span>
                  gestilok
                </span>
                <span className="product-avatar">A</span>
              </div>
              <div className="product-app-body">
                <div className="product-sidebar">
                  <span className="is-active" />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="product-dashboard">
                  <div className="product-dashboard-title">
                    <div>
                      <span>{t("previewLabel")}</span>
                      <strong>{t("previewOverview")}</strong>
                    </div>
                    <span className="product-add">+</span>
                  </div>
                  <div className="product-summary">
                    <span className="product-summary-icon">⌂</span>
                    <span>
                      <small>{t("previewProperties")}</small>
                      <i />
                    </span>
                    <span className="product-summary-bars">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <div className="product-list-heading">
                    <strong>{t("previewProperties")}</strong>
                    <span>•••</span>
                  </div>
                  <div className="product-property">
                    <span className="property-illustration property-illustration-one" />
                    <span className="product-property-copy">
                      <strong>{t("previewPropertyOne")}</strong>
                      <small>{t("previewPropertyStatus")}</small>
                    </span>
                    <i />
                  </div>
                  <div className="product-property">
                    <span className="property-illustration property-illustration-two" />
                    <span className="product-property-copy">
                      <strong>{t("previewPropertyTwo")}</strong>
                      <small>{t("previewPropertyStatus")}</small>
                    </span>
                    <i />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="proof-caption">
            <div>
              <p className="eyebrow">{t("proofLabel")}</p>
              <h2>{proofProject?.title ?? "Gestilok"}</h2>
              <p>{t("proofText")}</p>
            </div>
            <Link className="proof-link" href="/realisations/gestilok">
              {t("proofLink")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </aside>
      </section>

      <section aria-labelledby="expertises-title" className="home-section page-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / {t("expertisesLabel")}</p>
            <h2 id="expertises-title">{t("expertisesTitle")}</h2>
          </div>
          <p className="section-intro">{t("expertisesIntro")}</p>
        </div>
        <ul className="expertise-grid">
          {services.map((service) => (
            <li key={service.slug}>
              <Link className="expertise-card" href={`/services#${service.slug}`}>
                <span className="expertise-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.tagline}</p>
                <span className="text-link">{t("serviceLink")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects-title" className="home-section page-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / {t("projectsLabel")}</p>
            <h2 id="projects-title">{t("projectsTitle")}</h2>
          </div>
          <p className="section-intro">{t("projectsIntro")}</p>
        </div>
        <div className="featured-grid">
          {featuredProjects.map((project) => {
            const headlineResult = project.caseStudy.results[0];

            return (
              <article className="featured-project" key={project.slug}>
                <p className="eyebrow">
                  {project.client} · {project.year}
                </p>
                <h3>
                  <Link href={`/realisations/${project.slug}`}>{project.title}</Link>
                </h3>
                <p>{project.summary}</p>
                <dl className="metric">
                  <dt>{t("projectResultLabel")}</dt>
                  <dd>{headlineResult?.value ?? t("projectResultPending")}</dd>
                </dl>
                <Link className="text-link" href={`/realisations/${project.slug}`}>
                  {t("projectLink")}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <ScrollStory
        className="page-container"
        eyebrow={`03 / ${t("methodLabel")}`}
        id="methode"
        intro={t("methodIntro")}
        steps={methodSteps}
        title={t("methodTitle")}
        variant="method"
      />

      <section aria-labelledby="paths-title" className="home-section page-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / {t("pathsLabel")}</p>
            <h2 id="paths-title">{t("pathsTitle")}</h2>
          </div>
        </div>
        <div className="path-grid">
          <article className="path-card">
            <h3>{t("estimatePathTitle")}</h3>
            <p>{t("estimatePathText")}</p>
            <Link className="button button-primary" href="/estimate">
              {t("estimatePathCta")}
            </Link>
          </article>
          <article className="path-card">
            <h3>{t("advicePathTitle")}</h3>
            <p>{t("advicePathText")}</p>
            <Link className="button button-secondary" href="/conseil">
              {t("advicePathCta")}
            </Link>
          </article>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="contact-band page-container" id="contact">
        <div>
          <p className="eyebrow">05 / {t("contactLabel")}</p>
          <h2 id="contact-title">{t("contactIntro")}</h2>
        </div>
        <Link className="button button-primary" href="/contact">
          {tNavigation("contactCta")}
        </Link>
      </section>
    </main>
  );
}
