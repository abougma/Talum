import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/data/projects";

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

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("HomePage");
  const tNavigation = useTranslations("Navigation");
  const projects = getProjects(locale).slice(0, 3);

  const sections = [
    { id: "services", title: t("servicesTitle"), href: "/services" },
    { id: "realisations", title: t("projectsTitle"), href: "/realisations" },
    { id: "conseil", title: t("adviceTitle"), href: "/services" },
    { id: "estimateur", title: t("estimateTitle"), href: "/estimate" },
    { id: "a-propos", title: t("aboutTitle"), href: "/a-propos" },
  ];

  return (
    <main id="main">
      <section aria-labelledby="home-title" className="hero page-container">
        <div className="hero-copy">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 id="home-title">{t("title")}</h1>
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
          <p className="eyebrow">{t("proofLabel")}</p>
          <h2>{t("proofTitle")}</h2>
          <p>{t("proofText")}</p>
        </aside>
      </section>

      <section aria-labelledby="method-title" className="method-section page-container">
        <p className="eyebrow">01 / {t("sectionsLabel")}</p>
        <h2 id="method-title">{t("methodTitle")}</h2>
        <p className="method-line">{t("method")}</p>
      </section>

      <section aria-labelledby="explore-title" className="explore-section page-container">
        <p className="eyebrow">02 / TALUM</p>
        <h2 id="explore-title">{t("sectionsLabel")}</h2>
        <div className="section-grid">
          {sections.map(({ id, title, href }) => {
            const cardText =
              id === "realisations"
                ? projects.map((project) => project.title).join(" • ")
                : t("sectionPlaceholder");

            return (
              <Link className="section-card" href={href} id={id} key={id}>
                <p className="eyebrow">{id === "estimateur" ? "05" : "—"}</p>
                <h3>{title}</h3>
                <p>{cardText}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="contact-title" className="contact-band page-container" id="contact">
        <div>
          <p className="eyebrow">03 / CONTACT</p>
          <h2 id="contact-title">{t("contactIntro")}</h2>
        </div>
        <Link className="button button-primary" href="/contact">
          {tNavigation("contactCta")}
        </Link>
      </section>
    </main>
  );
}
