import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScrollStory } from "@/components/scroll-story";
import { getServices } from "@/data/services";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const tStory = await getTranslations({ locale, namespace: "ScrollStories" });
  const services = getServices(locale);
  const storySteps = services.map((service) => ({
    href: `#${service.slug}`,
    linkLabel: tStory("detailLink"),
    meta: service.number,
    text: service.tagline,
    title: service.title,
  }));

  return (
    <main id="main" className="page-container content-page">
      <header className="page-header">
        <p className="eyebrow">01 / {t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="lead">{t("intro")}</p>
      </header>

      <ScrollStory
        eyebrow={tStory("services.eyebrow")}
        id="expertises"
        intro={tStory("services.intro")}
        steps={storySteps}
        title={tStory("services.title")}
        variant="expertises"
      />

      <div className="service-list">
        {services.map((service) => (
          <section
            aria-labelledby={`${service.slug}-title`}
            className="service-section"
            id={service.slug}
            key={service.slug}
          >
            <div className="service-heading">
              <p className="eyebrow">{service.number}</p>
              <h2 id={`${service.slug}-title`}>{service.title}</h2>
              <p className="service-tagline">{service.tagline}</p>
              <p>{service.description}</p>
            </div>

            <div className="service-details">
              <div>
                <h3>{t("audienceLabel")}</h3>
                <ul className="bullet-list">
                  {service.audience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>{t("deliverablesLabel")}</h3>
                <ul className="bullet-list">
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>{t("technologiesLabel")}</h3>
                <ul className="tag-list">
                  {service.technologies.map((item) => (
                    <li className="tag" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                className="text-link"
                href={service.slug === "conseil" ? "/conseil" : "/estimate"}
              >
                {service.slug === "conseil" ? t("advisorCta") : t("serviceCta")}
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section aria-label={t("ctaLabel")} className="cta-band">
        <h2>{t("cta")}</h2>
        <div className="cta-actions">
          <Link className="button button-primary" href="/estimate">
            {t("estimateCta")}
          </Link>
          <Link className="button button-secondary" href="/contact">
            {t("contactCta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
