import type { ExpertiseSlug } from "./services";

export type ProjectMetric = {
  label: string;
  value: string;
  note?: string;
};

export type CaseStudy = {
  context: string;
  problem: string;
  solution: string;
  results: ProjectMetric[];
  learnings: string[];
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  role: string;
  featured: boolean;
  expertises: ExpertiseSlug[];
  summary: string;
  description: string;
  category: string;
  stack: string[];
  highlights: string[];
  url?: string;
  caseStudy: CaseStudy;
};

const projectsFr: Project[] = [
  {
    slug: "billetpro",
    title: "BilletPro",
    client: "Projet Talum",
    year: "[À COMPLÉTER]",
    role: "Conception et développement",
    featured: true,
    expertises: ["developpement"],
    summary: "Plateforme de billetterie en ligne pour le marché africain francophone.",
    description:
      "BilletPro permet aux organisateurs de créer et gérer leurs événements, aux acheteurs de réserver leurs billets en ligne, et aux scanners de contrôler les entrées à l’aide d’un QR code.",
    category: "Billetterie · Paiements · Événements",
    stack: ["Laravel", "JavaScript", "Stripe", "Wave / Mobile Money", "QR code"],
    highlights: [
      "Gestion complète des événements, places et accès",
      "Paiements en ligne avec Stripe et Wave / Mobile Money",
      "Validation d’entrée par QR code pour les scanners",
    ],
    caseStudy: {
      context:
        "BilletPro est une plateforme de billetterie en ligne destinée au marché africain francophone. Elle réunit la création d’événements, la vente de billets et le contrôle des entrées dans un même outil.",
      problem:
        "Un organisateur doit vendre des places, encaisser avec les moyens de paiement locaux et vérifier les billets à l’entrée. Répartir ces étapes entre plusieurs outils complique le suivi des ventes et le contrôle sur place.",
      solution:
        "La plateforme couvre le parcours complet : création et gestion de l’événement, réservation et paiement en ligne (Stripe, Wave / Mobile Money, FCFA), puis validation de l’entrée par QR code avec un scanner. Les organisateurs suivent les places et les accès depuis un espace dédié.",
      results: [
        { label: "Statut", value: "En ligne" },
        { label: "Événements accompagnés", value: "[À COMPLÉTER]", note: "volume et période à préciser" },
        { label: "Billets vendus", value: "[À COMPLÉTER]", note: "volume et période à préciser" },
      ],
      learnings: [
        "Sur ce marché, la couverture des moyens de paiement compte autant que l’interface : Stripe seul ne suffit pas.",
        "Le contrôle d’entrée a été pensé autour d’un QR code et d’un scanner, pour rester simple et rapide sur le terrain.",
      ],
    },
  },
  {
    slug: "jobtrack",
    title: "JobTrack",
    client: "Projet Talum",
    year: "[À COMPLÉTER]",
    role: "Conception et développement",
    featured: true,
    expertises: ["developpement"],
    summary: "CRM de recherche d’emploi pour suivre les candidatures et préparer les entretiens.",
    description:
      "JobTrack aide les candidats à suivre leur parcours, organiser leurs candidatures, analyser leur profil, générer des CV et préparer leurs entretiens avec des outils de conseil et de conformité RGPD.",
    category: "CRM · Emploi · Productivité",
    stack: ["Application web", "CRM", "Génération de CV", "RGPD", "Préparation d’entretien"],
    highlights: [
      "Suivi des candidatures et tableau de bord d’avancement",
      "Profil professionnel et préparation d’entretien",
      "Conformité RGPD et espaces d’organisation",
    ],
    caseStudy: {
      context:
        "JobTrack est un CRM de recherche d’emploi : il rassemble les candidatures, le profil, les documents et la préparation d’entretien dans un espace unique.",
      problem:
        "Une recherche d’emploi implique de nombreuses candidatures, relances et entretiens. Sans suivi structuré, les échéances se perdent et la préparation devient difficile à organiser.",
      solution:
        "L’application propose un tableau de bord d’avancement, un suivi des candidatures, un profil professionnel, la génération de CV et des outils de préparation d’entretien, avec des espaces organisés et une approche RGPD.",
      results: [
        { label: "Statut", value: "[À COMPLÉTER]" },
        { label: "Candidatures suivies", value: "[À COMPLÉTER]", note: "volume et période à préciser" },
        { label: "Utilisateurs", value: "[À COMPLÉTER]", note: "nombre et période à préciser" },
      ],
      learnings: [
        "Le sujet impose une vigilance RGPD dès la conception : les données de candidature sont personnelles et parfois sensibles.",
        "La génération de documents et le suivi de candidatures doivent rester séparés pour que chaque parcours évolue sans casser l’autre.",
      ],
    },
  },
  {
    slug: "livraison",
    title: "Plateforme de livraison",
    client: "Projet Talum",
    year: "[À COMPLÉTER]",
    role: "Conception et développement",
    featured: false,
    expertises: ["developpement"],
    summary: "Application de livraison de colis avec prise en charge opérateur et suivi client.",
    description:
      "Une demande de livraison est créée par le client, prise en charge par un livreur puis livrée au destinataire avec un parcours de suivi simple et fiable.",
    category: "Logistique · Livraison · Gestion de parcours",
    stack: ["Application web", "Back-office", "Suivi de livraison", "Dispatch"],
    highlights: [
      "Création de demande en quelques clics",
      "Assignation et suivi du livreur",
      "Validation de la livraison avec destinataire",
    ],
    caseStudy: {
      context:
        "Une application de livraison de colis qui relie un client, un livreur et un destinataire autour d’une même demande.",
      problem:
        "Une livraison se perd facilement entre la demande, l’assignation du livreur et la confirmation au destinataire. Le suivi manque de visibilité pour le client comme pour l’opérateur.",
      solution:
        "Le parcours est découpé en étapes explicites : création de la demande, prise en charge par un livreur, suivi et validation de la livraison avec le destinataire. Un back-office et un mécanisme de dispatch coordonnent les opérations.",
      results: [
        { label: "Statut", value: "[À COMPLÉTER]" },
        { label: "Livraisons traitées", value: "[À COMPLÉTER]", note: "volume et période à préciser" },
        { label: "Parcours", value: "Demande → prise en charge → livraison" },
      ],
      learnings: [
        "La valeur d’un tel outil tient à la clarté des états : chaque partie doit savoir où en est la livraison.",
        "Le back-office et le parcours client doivent partager le même modèle de statuts pour éviter les divergences.",
      ],
    },
  },
  {
    slug: "gestilok",
    title: "Gestilok",
    client: "Projet Talum",
    year: "[À COMPLÉTER]",
    role: "Conception, développement et mise en production",
    featured: true,
    expertises: ["developpement", "cloud-devops"],
    summary: "SaaS de gestion locative conçu et mis en production.",
    description:
      "Gestilok sert les gestionnaires immobiliers, propriétaires, locataires et candidats locataires dans la gestion des biens, des loyers, des demandes et des relations locatives.",
    category: "Immobilier · SaaS · Gestion locative",
    stack: ["Laravel", "PHP", "JavaScript", "VPS", "CI/CD"],
    highlights: [
      "Gestion des biens, locataires et demandes",
      "Tableaux de bord et suivi locatif",
      "Mise en production sur VPS avec CI/CD",
    ],
    url: "https://gestilok.com/",
    caseStudy: {
      context:
        "Gestilok est un SaaS de gestion locative conçu et mis en production. Il sert les gestionnaires immobiliers, propriétaires, locataires et candidats locataires.",
      problem:
        "La gestion locative combine des biens, des loyers, des demandes et des relations entre plusieurs profils. Sans outil adapté, le suivi devient dispersé et les informations se dupliquent.",
      solution:
        "Une plateforme web en PHP/Laravel couvrant la gestion des biens, des locataires et des demandes, avec des tableaux de bord de suivi locatif. Le déploiement repose sur un VPS et une chaîne CI/CD, avec des utilisateurs réels en production.",
      results: [
        { label: "Statut", value: "En production" },
        { label: "Utilisateurs réels", value: "Oui" },
        { label: "Utilisateurs actifs", value: "[À COMPLÉTER]", note: "nombre et période à préciser" },
      ],
      learnings: [
        "La mise en production change les priorités : sauvegardes, supervision et procédures d’exploitation comptent autant que les fonctionnalités.",
        "Un SaaS se juge sur la durée : la maintenance et la lisibilité du code conditionnent les évolutions.",
      ],
    },
  },
  {
    slug: "wesign",
    title: "Wesign",
    client: "Projet Talum",
    year: "[À COMPLÉTER]",
    role: "Conception et développement",
    featured: false,
    expertises: ["developpement"],
    summary: "Application web complète de gestion des présences étudiantes.",
    description:
      "Wesign permet de gérer les présences d’étudiants avec sécurité d’accès, tableaux de bord et gestion de session renforcée.",
    category: "Éducation · Présences · Administration",
    stack: ["Application web", "Authentification", "Gestion de session", "Tableaux de bord"],
    highlights: [
      "Authentification sécurisée",
      "Tableaux de bord de suivi des présences",
      "Gestion de session et des droits d’accès",
    ],
    caseStudy: {
      context:
        "Wesign est une application web de gestion des présences étudiantes, destinée aux équipes administratives et pédagogiques.",
      problem:
        "Le suivi des présences doit être fiable, rapide et réservé aux bonnes personnes. Un tableur ou un processus manuel expose à des erreurs et à un manque de traçabilité.",
      solution:
        "L’application propose une authentification sécurisée, une gestion de session et des droits d’accès, ainsi que des tableaux de bord de suivi des présences.",
      results: [
        { label: "Statut", value: "[À COMPLÉTER]" },
        { label: "Étudiants suivis", value: "[À COMPLÉTER]", note: "volume et période à préciser" },
        { label: "Sécurité", value: "Authentification et gestion de session" },
      ],
      learnings: [
        "L’authentification et la gestion de session sont des sujets de conception à part entière, pas des détails d’implémentation.",
        "Les tableaux de bord doivent répondre à une question précise, sinon ils ajoutent de la charge sans aider à décider.",
      ],
    },
  },
];

const projectsEn: Project[] = [
  {
    slug: "billetpro",
    title: "BilletPro",
    client: "Talum project",
    year: "[TO BE COMPLETED]",
    role: "Design and development",
    featured: true,
    expertises: ["developpement"],
    summary: "Online ticketing platform for the francophone African market.",
    description:
      "BilletPro lets organisers create and manage events, buyers purchase tickets online, and scanners validate access with a QR code.",
    category: "Ticketing · Payments · Events",
    stack: ["Laravel", "JavaScript", "Stripe", "Wave / Mobile Money", "QR code"],
    highlights: [
      "Full event and ticket management",
      "Online payments with Stripe and Wave / Mobile Money",
      "QR code validation for access control",
    ],
    caseStudy: {
      context:
        "BilletPro is an online ticketing platform for the francophone African market. It brings event creation, ticket sales and access control into a single tool.",
      problem:
        "An organiser needs to sell seats, collect payments with local methods and validate tickets at the door. Spreading these steps across several tools makes sales tracking and on-site control harder.",
      solution:
        "The platform covers the full journey: event creation and management, online booking and payment (Stripe, Wave / Mobile Money, FCFA), then QR code validation with a scanner. Organisers track seats and access from a dedicated workspace.",
      results: [
        { label: "Status", value: "Live" },
        { label: "Events supported", value: "[TO BE COMPLETED]", note: "volume and period to confirm" },
        { label: "Tickets sold", value: "[TO BE COMPLETED]", note: "volume and period to confirm" },
      ],
      learnings: [
        "In this market, payment coverage matters as much as the interface: Stripe alone is not enough.",
        "Access control was designed around a QR code and a scanner to stay simple and fast in the field.",
      ],
    },
  },
  {
    slug: "jobtrack",
    title: "JobTrack",
    client: "Talum project",
    year: "[TO BE COMPLETED]",
    role: "Design and development",
    featured: true,
    expertises: ["developpement"],
    summary: "Job search CRM for tracking applications and preparing interviews.",
    description:
      "JobTrack helps candidates track their application journey, organise their workflow, review their profile, generate CVs and prepare interviews with GDPR-friendly tools.",
    category: "CRM · Jobs · Productivity",
    stack: ["Web app", "CRM", "CV generation", "GDPR", "Interview preparation"],
    highlights: [
      "Application pipeline tracking and dashboard",
      "Professional profile and interview preparation",
      "GDPR compliance and organised workspaces",
    ],
    caseStudy: {
      context:
        "JobTrack is a job search CRM that brings applications, profile, documents and interview preparation into a single workspace.",
      problem:
        "A job search involves many applications, follow-ups and interviews. Without structured tracking, deadlines slip and preparation becomes hard to organise.",
      solution:
        "The application provides a progress dashboard, application tracking, a professional profile, CV generation and interview preparation tools, with organised workspaces and a GDPR-aware approach.",
      results: [
        { label: "Status", value: "[TO BE COMPLETED]" },
        { label: "Applications tracked", value: "[TO BE COMPLETED]", note: "volume and period to confirm" },
        { label: "Users", value: "[TO BE COMPLETED]", note: "number and period to confirm" },
      ],
      learnings: [
        "The subject requires GDPR care from the design stage: application data is personal and sometimes sensitive.",
        "Document generation and application tracking must stay separate so each journey can evolve without breaking the other.",
      ],
    },
  },
  {
    slug: "livraison",
    title: "Delivery platform",
    client: "Talum project",
    year: "[TO BE COMPLETED]",
    role: "Design and development",
    featured: false,
    expertises: ["developpement"],
    summary: "Parcel delivery application with operator assignment and customer tracking.",
    description:
      "A customer creates a delivery request, a courier takes charge of it and delivers it to the recipient through a simple and reliable tracking flow.",
    category: "Logistics · Delivery · Journey management",
    stack: ["Web app", "Back office", "Delivery tracking", "Dispatch"],
    highlights: [
      "Quick creation of delivery requests",
      "Courier assignment and trip tracking",
      "Delivery confirmation with recipient validation",
    ],
    caseStudy: {
      context:
        "A parcel delivery application connecting a customer, a courier and a recipient around the same request.",
      problem:
        "A delivery easily gets lost between the request, courier assignment and recipient confirmation. Tracking lacks visibility for both the customer and the operator.",
      solution:
        "The journey is split into explicit steps: request creation, courier assignment, tracking and delivery confirmation with the recipient. A back office and a dispatch mechanism coordinate operations.",
      results: [
        { label: "Status", value: "[TO BE COMPLETED]" },
        { label: "Deliveries handled", value: "[TO BE COMPLETED]", note: "volume and period to confirm" },
        { label: "Journey", value: "Request → assignment → delivery" },
      ],
      learnings: [
        "The value of such a tool lies in clear states: every party must know where the delivery stands.",
        "The back office and the customer journey must share the same status model to avoid divergence.",
      ],
    },
  },
  {
    slug: "gestilok",
    title: "Gestilok",
    client: "Talum project",
    year: "[TO BE COMPLETED]",
    role: "Design, development and production release",
    featured: true,
    expertises: ["developpement", "cloud-devops"],
    summary: "Rental management SaaS designed and shipped to production.",
    description:
      "Gestilok supports property managers, landlords, tenants and applicants in managing assets, rent, requests and rental relationships.",
    category: "Real estate · SaaS · Rental management",
    stack: ["Laravel", "PHP", "JavaScript", "VPS", "CI/CD"],
    highlights: [
      "Property, tenant and request management",
      "Dashboards and rental monitoring",
      "Production deployment on a VPS with CI/CD",
    ],
    url: "https://gestilok.com/",
    caseStudy: {
      context:
        "Gestilok is a rental management SaaS designed and shipped to production. It serves property managers, landlords, tenants and applicants.",
      problem:
        "Rental management combines properties, rent, requests and relationships between several profiles. Without a suitable tool, tracking becomes scattered and information is duplicated.",
      solution:
        "A PHP/Laravel web platform covering property, tenant and request management, with rental monitoring dashboards. Deployment runs on a VPS with a CI/CD pipeline, with real users in production.",
      results: [
        { label: "Status", value: "In production" },
        { label: "Real users", value: "Yes" },
        { label: "Active users", value: "[TO BE COMPLETED]", note: "number and period to confirm" },
      ],
      learnings: [
        "Production changes priorities: backups, monitoring and operating procedures matter as much as features.",
        "A SaaS is judged over time: maintenance and code readability drive future changes.",
      ],
    },
  },
  {
    slug: "wesign",
    title: "Wesign",
    client: "Talum project",
    year: "[TO BE COMPLETED]",
    role: "Design and development",
    featured: false,
    expertises: ["developpement"],
    summary: "Complete student attendance management web application.",
    description:
      "Wesign manages student attendance with secure access, dashboards and enhanced session management.",
    category: "Education · Attendance · Administration",
    stack: ["Web app", "Authentication", "Session management", "Dashboards"],
    highlights: [
      "Secure authentication",
      "Attendance tracking dashboards",
      "Session and access-right management",
    ],
    caseStudy: {
      context:
        "Wesign is a student attendance management web application for administrative and teaching teams.",
      problem:
        "Attendance tracking must be reliable, fast and restricted to the right people. A spreadsheet or manual process is error-prone and lacks traceability.",
      solution:
        "The application provides secure authentication, session management and access rights, along with attendance tracking dashboards.",
      results: [
        { label: "Status", value: "[TO BE COMPLETED]" },
        { label: "Students tracked", value: "[TO BE COMPLETED]", note: "volume and period to confirm" },
        { label: "Security", value: "Authentication and session management" },
      ],
      learnings: [
        "Authentication and session management are design topics in their own right, not implementation details.",
        "Dashboards must answer a specific question, otherwise they add workload without helping decisions.",
      ],
    },
  },
];

export function getProjects(locale: string): Project[] {
  return locale === "en" ? projectsEn : projectsFr;
}

export function getProject(locale: string, slug: string): Project | undefined {
  return getProjects(locale).find((project) => project.slug === slug);
}

export function getFeaturedProjects(locale: string): Project[] {
  return getProjects(locale).filter((project) => project.featured);
}

export function getProjectSlugs(): string[] {
  return projectsFr.map((project) => project.slug);
}
