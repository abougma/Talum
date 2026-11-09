import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectGallery } from "@/components/project-gallery";
import { ScrollStory } from "@/components/scroll-story";
import { getFeaturedProjects, getProjects } from "@/data/projects";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Réalisations",
    description: "Quelques projets et livrables réalisés par Taloom.",
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = getProjects(locale);
  const featuredProjects = getFeaturedProjects(locale);
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });
  const tStory = await getTranslations({ locale, namespace: "ScrollStories" });
  const storySteps = featuredProjects.slice(0, 3).map((project) => ({
    href: `/realisations/${project.slug}`,
    linkLabel: tStory("caseLink"),
    meta: project.category,
    text: project.summary,
    title: project.title,
  }));

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">02 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <ScrollStory
        eyebrow={tStory("projects.eyebrow")}
        id="projets-phares"
        intro={tStory("projects.intro")}
        steps={storySteps}
        title={tStory("projects.title")}
        variant="projects"
      />

      <ProjectGallery projects={projects} />
    </main>
  );
}
