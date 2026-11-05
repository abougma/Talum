export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  categoryKey: "ticketing" | "employment" | "logistics" | "realEstate" | "education";
  stack: string[];
  highlights: string[];
  url?: string;
};

export const projectsByLocale: Record<"fr" | "en", Project[]> = {
  fr: [
    {
      slug: "billetpro",
      title: "BilletPro",
      summary: "Plateforme de billetterie en ligne pour le marché africain francophone.",
      description:
        "BilletPro permet aux organisateurs de créer et gérer leurs événements, aux acheteurs de réserver leurs billets en ligne, et aux scanners de contrôler les entrées à l’aide d’un QR code.",
      category: "Billetterie · Paiements · Événements",
      categoryKey: "ticketing",
      stack: ["Paiements Stripe", "Wave / Mobile Money", "FCFA", "QR code"],
      highlights: [
        "Gestion complète des événements, places et accès",
        "Paiements en ligne avec Stripe et Wave / Mobile Money",
        "Validation d’entrée via QR code pour les scanners",
      ],
    },
    {
      slug: "jobtrack",
      title: "JobTrack",
      summary: "CRM de recherche d’emploi pour suivre les candidatures et préparer les entretiens.",
      description:
        "JobTrack aide les candidats à suivre leur parcours, organiser leurs candidatures, analyser leur profil, générer des CV et préparer leurs entretiens avec des outils de conseil et de conformité RGPD.",
      category: "CRM · Emploi · Productivité",
      categoryKey: "employment",
      stack: [
        "CRM",
        "Suivi des candidatures",
        "Génération de CV",
        "RGPD",
        "Préparation d’entretien",
      ],
      highlights: [
        "Suivi des candidatures et tableau de bord d’avancement",
        "Profil professionnel et préparation d’entretien",
        "Conformité RGPD et espaces d’organisation",
      ],
    },
    {
      slug: "livraison",
      title: "Plateforme de livraison",
      summary: "Application de livraison de colis avec prise en charge opérateur et suivi client.",
      description:
        "Une demande de livraison est créée par le client, prise en charge par un livreur puis livrée au destinataire avec un parcours de suivi simple et fiable.",
      category: "Logistique · Livraison · Gestion de parcours",
      categoryKey: "logistics",
      stack: ["Application", "Back-office", "Suivi de livraison", "Dispatch"],
      highlights: [
        "Création de demande en quelques clics",
        "Assignation et suivi du livreur",
        "Validation de la livraison avec destinataire",
      ],
    },
    {
      slug: "gestilok",
      title: "Gestilok",
      url: "https://gestilok.com/",
      summary: "Plateforme web moderne de gestion locative développée avec Laravel.",
      description:
        "Gestilok sert les gestionnaires immobiliers, propriétaires, locataires et candidats locataires dans la gestion des biens, des loyers, des demandes et des relations locatives.",
      category: "Immobilier · SaaS · Gestion locative",
      categoryKey: "realEstate",
      stack: ["Laravel", "PHP", "SaaS", "Gestion locative"],
      highlights: [
        "Gestion des biens, locataires et demandes",
        "Tableaux de bord et suivi locatif",
        "Expérience d’usage orientée gestion immobilière",
      ],
    },
    {
      slug: "wesign",
      title: "Wesign",
      summary: "Application web complète de gestion des présences étudiantes.",
      description:
        "Wesign permet de gérer les présences d’étudiants avec sécurité d’accès, tableaux de bord et session management renforcé.",
      category: "Éducation · Présences · Gestion d’administration",
      categoryKey: "education",
      stack: ["Web app", "Auth", "Session management", "Dashboards"],
      highlights: [
        "Authentification sécurisée",
        "Tableaux de bord de suivi des présences",
        "Gestion de session et des droits d’accès",
      ],
    },
  ],
  en: [
    {
      slug: "billetpro",
      title: "BilletPro",
      summary: "Online ticketing platform for the francophone African market.",
      description:
        "BilletPro lets organizers create and manage events, buyers purchase tickets online, and scanners validate access with a QR code.",
      category: "Ticketing · Payments · Events",
      categoryKey: "ticketing",
      stack: ["Stripe payments", "Wave / Mobile Money", "FCFA", "QR code"],
      highlights: [
        "Full event and ticket management",
        "Online payments with Stripe and Wave / Mobile Money",
        "QR code validation for access control",
      ],
    },
    {
      slug: "jobtrack",
      title: "JobTrack",
      summary: "Job search CRM for tracking applications and interview preparation.",
      description:
        "JobTrack helps candidates track their application journey, organize their workflow, review their profile, generate CVs and prepare interviews with GDPR-friendly tools.",
      category: "CRM · Jobs · Productivity",
      categoryKey: "employment",
      stack: ["CRM", "Application tracking", "CV generation", "GDPR", "Interview prep"],
      highlights: [
        "Application pipeline tracking and dashboard",
        "Professional profile and interview preparation",
        "GDPR compliance and organized workspaces",
      ],
    },
    {
      slug: "livraison",
      title: "Delivery platform",
      summary: "Parcel delivery application with operator assignment and customer tracking.",
      description:
        "A customer creates a delivery request, a courier takes charge of it and delivers it to the recipient through a simple and reliable tracking flow.",
      category: "Logistics · Delivery · Journey management",
      categoryKey: "logistics",
      stack: ["Application", "Back office", "Delivery tracking", "Dispatch"],
      highlights: [
        "Quick creation of delivery requests",
        "Courier assignment and trip tracking",
        "Delivery confirmation with recipient validation",
      ],
    },
    {
      slug: "gestilok",
      title: "Gestilok",
      url: "https://gestilok.com/",
      summary: "Modern web platform for rental management built with Laravel.",
      description:
        "Gestilok supports property managers, landlords, tenants and applicants in managing assets, rent, requests and rental relationships.",
      category: "Real estate · SaaS · Rental management",
      categoryKey: "realEstate",
      stack: ["Laravel", "PHP", "SaaS", "Rental management"],
      highlights: [
        "Property and tenancy management",
        "Dashboards and rental monitoring",
        "Usage experience focused on property operations",
      ],
    },
    {
      slug: "wesign",
      title: "Wesign",
      summary: "Complete student attendance management web application.",
      description:
        "Wesign manages student attendance with secure access, dashboards and enhanced session management.",
      category: "Education · Attendance · Admin systems",
      categoryKey: "education",
      stack: ["Web app", "Auth", "Session management", "Dashboards"],
      highlights: [
        "Secure authentication",
        "Attendance tracking dashboards",
        "Session and access-right management",
      ],
    },
  ],
};

export function getProjects(locale: string) {
  return locale === "en" ? projectsByLocale.en : projectsByLocale.fr;
}
