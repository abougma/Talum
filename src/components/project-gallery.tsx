"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "@/data/projects";

const categoryKeys = [
  "all",
  "ticketing",
  "employment",
  "logistics",
  "realEstate",
  "education",
] as const;
type CategoryKey = (typeof categoryKeys)[number];

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
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const visibleProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.categoryKey === activeCategory);

  return (
    <>
      <div aria-label={t("filterLabel")} className="project-filters" role="group">
        {categoryKeys.map((category) => (
          <button
            aria-pressed={activeCategory === category}
            className={activeCategory === category ? "project-filter is-active" : "project-filter"}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {t(`filters.${category}`)}
          </button>
        ))}
      </div>

      <p className="project-count" aria-live="polite">
        {t("count", { count: visibleProjects.length })}
      </p>

      <section className="projects-grid" aria-label={t("eyebrow")}>
        {visibleProjects.map((project, index) => (
          <article
            className={`project-card${visibleProjects.length === 1 || (index === 0 && activeCategory === "all") ? " project-card-featured" : ""}`}
            key={project.slug}
          >
            <ProjectArtwork slug={project.slug} title={project.title} />
            <div className="project-copy">
              <p className="eyebrow project-category">{project.category}</p>
              <div className="project-heading">
                <h2>{project.title}</h2>
                <span className="project-number">
                  {String(projects.indexOf(project) + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="project-summary">{project.summary}</p>
              <p className="project-description">{project.description}</p>

              <ul className="project-highlights">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="tag-list" aria-label={t("stackLabel")}>
                {project.stack.map((item) => (
                  <span key={`${project.slug}-${item}`} className="tag">
                    {item}
                  </span>
                ))}
              </div>

              {project.url ? (
                <a className="project-link" href={project.url} rel="noreferrer" target="_blank">
                  {t("seeMore")} <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
