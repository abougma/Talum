"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/data/projects";
import type { ExpertiseSlug } from "@/data/services";

const expertiseKeys: (ExpertiseSlug | "all")[] = [
  "all",
  "developpement",
  "cloud-devops",
  "gestion-de-projet",
  "ia",
  "conseil",
];

function ProjectArtwork({ slug, title }: Pick<Project, "slug" | "title">) {
  return (
    <div aria-hidden="true" className={`project-art project-art-${slug}`}>
      <div className="art-window">
        <div className="art-toolbar">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className="art-content">
          {slug === "billetpro" ? (
            <div className="art-ticket-layout">
              <div className="art-sidebar">
                <b>{title}</b>
                <span />
                <span />
                <span />
              </div>
              <div className="art-main">
                <div className="art-title-line" />
                <div className="art-event-card">
                  <div />
                  <span />
                  <i />
                </div>
                <div className="art-event-row">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          ) : slug === "jobtrack" ? (
            <div className="art-dashboard">
              <div className="art-title-line" />
              <div className="art-stat-row">
                <i />
                <i />
                <i />
              </div>
              <div className="art-chart">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="art-list-row">
                <i />
                <span />
                <b />
              </div>
            </div>
          ) : slug === "livraison" ? (
            <div className="art-delivery">
              <div className="art-map">
                <span />
                <i />
                <b />
              </div>
              <div className="art-delivery-card">
                <div className="art-title-line" />
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : slug === "gestilok" ? (
            <div className="art-property">
              <div className="art-title-line" />
              <div className="art-property-row">
                <i />
                <i />
                <i />
              </div>
              <div className="art-property-list">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : (
            <div className="art-attendance">
              <div className="art-title-line" />
              <div className="art-attendance-grid">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="art-attendance-footer">
                <span />
                <b />
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="art-index">T / {slug.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const t = useTranslations("ProjectsPage");
  const [activeExpertise, setActiveExpertise] = useState<ExpertiseSlug | "all">("all");
  const availableExpertises = expertiseKeys.filter(
    (expertise) => expertise === "all" || projects.some((project) => project.expertises.includes(expertise)),
  );
  const visibleProjects =
    activeExpertise === "all"
      ? projects
      : projects.filter((project) => project.expertises.includes(activeExpertise));

  return (
    <>
      <div aria-label={t("filterLabel")} className="project-filters" role="group">
        {availableExpertises.map((expertise) => (
          <button
            aria-pressed={activeExpertise === expertise}
            className={activeExpertise === expertise ? "project-filter is-active" : "project-filter"}
            key={expertise}
            onClick={() => setActiveExpertise(expertise)}
            type="button"
          >
            {t(`filters.${expertise}`)}
          </button>
        ))}
      </div>

      <p className="project-count" aria-live="polite">
        {t("count", { count: visibleProjects.length })}
      </p>

      <section className="projects-grid" aria-label={t("eyebrow")}>
        {visibleProjects.map((project, index) => {
          const headlineResult = project.caseStudy.results[0];

          return (
            <article
              className={`project-card${index === 0 && activeExpertise === "all" ? " project-card-featured" : ""}`}
              key={project.slug}
            >
              <ProjectArtwork slug={project.slug} title={project.title} />
              <div className="project-copy">
                <p className="eyebrow project-category">{project.category}</p>
                <div className="project-heading">
                  <h2>
                    <Link href={`/realisations/${project.slug}`}>{project.title}</Link>
                  </h2>
                  <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="project-meta">
                  {project.client} · {project.year} · {project.role}
                </p>
                <p className="project-summary">{project.summary}</p>

                {headlineResult ? (
                  <dl className="metric">
                    <dt>{t("resultLabel")}</dt>
                    <dd>{headlineResult.value}</dd>
                  </dl>
                ) : null}

                <div className="tag-list" aria-label={t("stackLabel")}>
                  {project.stack.map((item) => (
                    <span key={`${project.slug}-${item}`} className="tag">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <Link className="text-link" href={`/realisations/${project.slug}`}>
                    {t("caseStudyLink")}
                  </Link>
                  {project.url ? (
                    <a className="text-link" href={project.url} rel="noreferrer" target="_blank">
                      {t("seeMore")} <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {visibleProjects.length === 0 ? (
        <div className="empty-state">
          <p>{t("empty")}</p>
          <button className="button button-secondary" onClick={() => setActiveExpertise("all")} type="button">
            {t("reset")}
          </button>
        </div>
      ) : null}
    </>
  );
}
