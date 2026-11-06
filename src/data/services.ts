export type ExpertiseSlug =
  | "developpement"
  | "cloud-devops"
  | "gestion-de-projet"
  | "ia"
  | "conseil";

export type Service = {
  slug: ExpertiseSlug;
  number: string;
  title: string;
  tagline: string;
  description: string;
  audience: string[];
  deliverables: string[];
  technologies: string[];
};

const servicesFr: Service[] = [
  {
    slug: "developpement",
    number: "01",
    title: "Développement web et applicatif",
    tagline: "Des applications utiles, lisibles et maintenables.",
    description:
      "Conception et développement de sites, d’applications métier et d’API. Le travail part du besoin réel, fixe un périmètre explicite et livre un code structuré, testé sur les parcours critiques et documenté pour la suite.",
    audience: ["TPE et PME", "Startups", "Écoles et associations"],
    deliverables: [
      "Cadrage fonctionnel et technique",
      "Interface responsive et accessible",
      "Application web ou API documentée",
      "Jeu de tests sur les parcours critiques",
      "Mise en production et documentation",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "Laravel", "PostgreSQL"],
  },
  {
    slug: "cloud-devops",
    number: "02",
    title: "Cloud & DevOps",
    tagline: "Un socle reproductible, supervisé et réversible.",
    description:
      "Mise en place de l’environnement technique : conteneurisation, intégration et déploiement continus, gestion des secrets, sauvegardes et supervision. L’objectif est de rendre les mises en production calmes et réversibles.",
    audience: ["Équipes techniques", "Startups en croissance", "PME avec un existant à fiabiliser"],
    deliverables: [
      "Environnements de développement et de production",
      "Pipeline d’intégration et de déploiement",
      "Procédure de sauvegarde et de restauration",
      "Supervision et alertes utiles",
      "Documentation d’exploitation",
    ],
    technologies: ["Docker", "GitHub Actions", "VPS", "Linux", "Nginx", "CI/CD"],
  },
  {
    slug: "gestion-de-projet",
    number: "03",
    title: "Gestion de projet",
    tagline: "Un périmètre clair et des décisions visibles.",
    description:
      "Cadrage, priorisation et pilotage du projet avec des points réguliers et des livrables explicites. La gestion de projet sert à éviter les malentendus, à rendre les arbitrages visibles et à sécuriser la livraison.",
    audience: ["Dirigeants de PME", "Équipes produit", "Écoles et associations"],
    deliverables: [
      "Note de cadrage et objectifs mesurables",
      "Backlog priorisé et planning",
      "Rituels de suivi et comptes rendus",
      "Registre des risques et des décisions",
      "Recette et bilan de fin de projet",
    ],
    technologies: ["Scrum", "Kanban", "GitHub Projects", "Jira / Linear selon le contexte"],
  },
  {
    slug: "ia",
    number: "04",
    title: "IA et automatisation",
    tagline: "Des usages encadrés, mesurés et utiles.",
    description:
      "Identification des tâches à automatiser, prototypage d’un usage IA, évaluation de la qualité et des coûts, puis intégration dans le SI. Les garde-fous (données, RGPD, validation humaine) sont définis avant la mise en production.",
    audience: ["PME avec des tâches répétitives", "Équipes support et opérations", "Startups"],
    deliverables: [
      "Cartographie des usages et des données",
      "Prototype mesuré (qualité, coût, latence)",
      "Intégration à l’outil ou au SI existant",
      "Garde-fous et procédure de validation",
      "Documentation et transfert de compétences",
    ],
    technologies: ["API LLM", "RAG", "Agents", "Automatisation", "TypeScript / Python"],
  },
  {
    slug: "conseil",
    number: "05",
    title: "Conseil et audit technique",
    tagline: "Clarifier avant d’investir.",
    description:
      "Revue d’une architecture, d’un code ou d’un projet en difficulté. Le diagnostic débouche sur des recommandations priorisées, chiffrées en effort, et un plan d’action compréhensible par les décideurs comme par les équipes.",
    audience: ["Dirigeants", "Équipes techniques", "Repreneurs d’un existant"],
    deliverables: [
      "Entretiens et revue du système",
      "Diagnostic des risques techniques",
      "Recommandations priorisées",
      "Plan d’action et estimation d’effort",
      "Atelier de restitution",
    ],
    technologies: ["Selon le système audité"],
  },
];

const servicesEn: Service[] = [
  {
    slug: "developpement",
    number: "01",
    title: "Web and application development",
    tagline: "Useful, readable and maintainable applications.",
    description:
      "Design and development of websites, business applications and APIs. Work starts from the real need, defines an explicit scope and delivers structured code, tested on critical journeys and documented for what comes next.",
    audience: ["Small and mid-sized businesses", "Startups", "Schools and non-profits"],
    deliverables: [
      "Functional and technical scoping",
      "Responsive and accessible interface",
      "Documented web application or API",
      "Test coverage of critical journeys",
      "Production release and documentation",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "Laravel", "PostgreSQL"],
  },
  {
    slug: "cloud-devops",
    number: "02",
    title: "Cloud & DevOps",
    tagline: "A reproducible, monitored and reversible foundation.",
    description:
      "Setting up the technical environment: containers, continuous integration and delivery, secret management, backups and monitoring. The goal is calm and reversible production releases.",
    audience: ["Engineering teams", "Growing startups", "Businesses with an existing platform to stabilise"],
    deliverables: [
      "Development and production environments",
      "Integration and deployment pipeline",
      "Backup and restore procedure",
      "Useful monitoring and alerts",
      "Operations documentation",
    ],
    technologies: ["Docker", "GitHub Actions", "VPS", "Linux", "Nginx", "CI/CD"],
  },
  {
    slug: "gestion-de-projet",
    number: "03",
    title: "Project management",
    tagline: "A clear scope and visible decisions.",
    description:
      "Scoping, prioritisation and project steering with regular checkpoints and explicit deliverables. Project management prevents misunderstandings, makes trade-offs visible and secures delivery.",
    audience: ["Business owners", "Product teams", "Schools and non-profits"],
    deliverables: [
      "Scoping note and measurable objectives",
      "Prioritised backlog and schedule",
      "Steering rituals and minutes",
      "Risk and decision log",
      "Acceptance and project review",
    ],
    technologies: ["Scrum", "Kanban", "GitHub Projects", "Jira / Linear depending on context"],
  },
  {
    slug: "ia",
    number: "04",
    title: "AI and automation",
    tagline: "Governed, measured and useful use cases.",
    description:
      "Identifying tasks to automate, prototyping an AI use case, measuring quality and cost, then integrating it into the information system. Safeguards (data, GDPR, human validation) are defined before production.",
    audience: ["Businesses with repetitive tasks", "Support and operations teams", "Startups"],
    deliverables: [
      "Use case and data mapping",
      "Measured prototype (quality, cost, latency)",
      "Integration with the existing tool or system",
      "Safeguards and validation procedure",
      "Documentation and knowledge transfer",
    ],
    technologies: ["LLM APIs", "RAG", "Agents", "Automation", "TypeScript / Python"],
  },
  {
    slug: "conseil",
    number: "05",
    title: "Technical consulting and audit",
    tagline: "Clarify before investing.",
    description:
      "Review of an architecture, codebase or struggling project. The diagnosis leads to prioritised recommendations, effort estimates and an action plan that is understandable to both decision-makers and teams.",
    audience: ["Executives", "Engineering teams", "Owners taking over an existing system"],
    deliverables: [
      "Interviews and system review",
      "Technical risk diagnosis",
      "Prioritised recommendations",
      "Action plan and effort estimate",
      "Restitution workshop",
    ],
    technologies: ["Depending on the system being audited"],
  },
];

export function getServices(locale: string): Service[] {
  return locale === "en" ? servicesEn : servicesFr;
}

export function getService(locale: string, slug: string): Service | undefined {
  return getServices(locale).find((service) => service.slug === slug);
}
