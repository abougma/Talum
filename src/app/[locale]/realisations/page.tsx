import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectGallery } from "@/components/project-gallery";
import { getProjects } from "@/data/projects";

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
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">02 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <ProjectGallery projects={projects} />
    </main>
  );
}
