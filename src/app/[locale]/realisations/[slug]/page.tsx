import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProject, getProjectSlugs } from "@/data/projects";
import { getService } from "@/data/services";

export const dynamicParams = false;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(locale, slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} — ${locale === "fr" ? "étude de cas" : "case study"}`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(locale, slug);
  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "CaseStudyPage" });
  const tProjects = await getTranslations({ locale, namespace: "ProjectsPage" });
  const expertises = project.expertises
    .map((expertise) => getService(locale, expertise)?.title ?? expertise)
    .join(" · ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    about: project.category,
    keywords: project.stack.join(", "),
  };

  return (
    <main id="main" className="page-container content-page">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <nav aria-label={t("breadcrumbLabel")} className="breadcrumb">
        <Link href="/">{t("breadcrumbHome")}</Link>
        <span aria-hidden="true">/</span>
        <Link href="/realisations">{tProjects("title")}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </nav>

      <header className="case-header">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{project.title}</h1>
          <p className="lead">{project.summary}</p>
          {project.url ? (
            <a className="text-link" href={project.url} rel="noreferrer" target="_blank">
              {t("visitProject")} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>

        <dl className="case-meta">
          <div>
            <dt>{t("metaClient")}</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>{t("metaYear")}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>{t("metaRole")}</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>{t("metaExpertises")}</dt>
            <dd>{expertises}</dd>
          </div>
        </dl>
      </header>

      <div className="case-body">
        <article className="case-main">
          <section aria-labelledby="context-title">
            <p className="eyebrow">01</p>
            <h2 id="context-title">{t("contextTitle")}</h2>
            <p>{project.caseStudy.context}</p>
          </section>

          <section aria-labelledby="problem-title">
            <p className="eyebrow">02</p>
            <h2 id="problem-title">{t("problemTitle")}</h2>
            <p>{project.caseStudy.problem}</p>
          </section>

          <section aria-labelledby="solution-title">
            <p className="eyebrow">03</p>
            <h2 id="solution-title">{t("solutionTitle")}</h2>
            <p>{project.caseStudy.solution}</p>
          </section>

          <section aria-labelledby="learnings-title">
            <p className="eyebrow">05</p>
            <h2 id="learnings-title">{t("learningsTitle")}</h2>
            <ul className="bullet-list">
              {project.caseStudy.learnings.map((learning) => (
                <li key={learning}>{learning}</li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="case-aside">
          <section aria-labelledby="results-title">
            <p className="eyebrow">04</p>
            <h2 id="results-title">{t("resultsTitle")}</h2>
            <dl className="case-results">
              {project.caseStudy.results.map((result) => (
                <div key={result.label}>
                  <dt>{result.label}</dt>
                  <dd>{result.value}</dd>
                  {result.note ? <p>{result.note}</p> : null}
                </div>
              ))}
            </dl>
            <p className="section-note">{t("pendingNote")}</p>
          </section>

          <section aria-labelledby="stack-title">
            <h2 id="stack-title">{t("stackTitle")}</h2>
            <ul className="tag-list">
              {project.stack.map((item) => (
                <li className="tag" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="case-cta">
            <h2>{t("ctaTitle")}</h2>
            <p>{t("ctaText")}</p>
            <Link className="button button-primary" href="/contact">
              {t("contactCta")}
            </Link>
            <Link className="text-link" href="/realisations">
              {t("backToProjects")}
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
