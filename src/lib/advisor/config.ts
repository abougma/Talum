import type {
  AdvisorApproach,
  AdvisorConfig,
  AdvisorConstraintId,
  AdvisorConstraintModifier,
  AdvisorRule,
  ApproachId,
} from "./types";

/**
 * Règles de l’assistant Conseil.
 *
 * Aucune règle ne contient de prix, de TVA ou de mention légale. Les durées
 * sont des ordres de grandeur indicatifs, explicitement présentés comme tels
 * dans l’interface. Les règles sont évaluées par priorité décroissante : la
 * première règle dont toutes les conditions correspondent gagne.
 */
export const advisorApproaches: Record<ApproachId, AdvisorApproach> = {
  cadrage: {
    serviceSlug: "gestion-de-projet",
    durationWeeks: { min: 1, max: 3 },
    stackKeys: ["Advisor.stack.scrum", "Advisor.stack.kanban", "Advisor.stack.githubProjects"],
    riskIds: ["perimetre", "budget"],
    nextStepId: "cadrage",
  },
  mvp: {
    serviceSlug: "developpement",
    durationWeeks: { min: 6, max: 10 },
    stackKeys: [
      "Advisor.stack.nextjs",
      "Advisor.stack.react",
      "Advisor.stack.typescript",
      "Advisor.stack.postgresql",
    ],
    riskIds: ["perimetre", "delai"],
    nextStepId: "cadrage",
  },
  plateforme: {
    serviceSlug: "developpement",
    durationWeeks: { min: 12, max: 20 },
    stackKeys: [
      "Advisor.stack.nextjs",
      "Advisor.stack.node",
      "Advisor.stack.typescript",
      "Advisor.stack.postgresql",
      "Advisor.stack.docker",
    ],
    riskIds: ["complexite", "hebergement", "perimetre"],
    nextStepId: "cadrage",
  },
  api: {
    serviceSlug: "developpement",
    durationWeeks: { min: 6, max: 12 },
    stackKeys: [
      "Advisor.stack.node",
      "Advisor.stack.typescript",
      "Advisor.stack.postgresql",
      "Advisor.stack.openapi",
      "Advisor.stack.tests",
    ],
    riskIds: ["securite", "integration", "complexite"],
    nextStepId: "cadrage",
  },
  fiabilisation: {
    serviceSlug: "cloud-devops",
    durationWeeks: { min: 4, max: 8 },
    stackKeys: [
      "Advisor.stack.docker",
      "Advisor.stack.githubActions",
      "Advisor.stack.vps",
      "Advisor.stack.nginx",
      "Advisor.stack.observability",
    ],
    riskIds: ["hebergement", "securite", "dette"],
    nextStepId: "contact",
  },
  automatisation: {
    serviceSlug: "ia",
    durationWeeks: { min: 4, max: 8 },
    stackKeys: [
      "Advisor.stack.llmApis",
      "Advisor.stack.rag",
      "Advisor.stack.automation",
      "Advisor.stack.typescript",
      "Advisor.stack.python",
    ],
    riskIds: ["qualite", "donnees", "dependance"],
    nextStepId: "cadrage",
  },
  audit: {
    serviceSlug: "conseil",
    durationWeeks: { min: 2, max: 4 },
    stackKeys: ["Advisor.stack.auditedSystem"],
    riskIds: ["perimetre", "dette", "securite"],
    nextStepId: "audit",
  },
  evolution: {
    serviceSlug: "developpement",
    durationWeeks: { min: 6, max: 12 },
    stackKeys: ["Advisor.stack.existingSystem", "Advisor.stack.tests", "Advisor.stack.cicd"],
    riskIds: ["regression", "dette", "perimetre"],
    nextStepId: "cadrage",
  },
};

export const advisorConstraintModifiers: Record<AdvisorConstraintId, AdvisorConstraintModifier> = {
  delai: { riskId: "delai", extraWeeks: 0 },
  "budget-limite": { riskId: "budget", extraWeeks: 0 },
  securite: { riskId: "securite", extraWeeks: 1 },
  conformite: { riskId: "conformite", extraWeeks: 1 },
  integration: { riskId: "integration", extraWeeks: 2 },
  "equipe-interne": { riskId: "transfert", extraWeeks: 1 },
  hebergement: { riskId: "hebergement", extraWeeks: 1 },
};

export const advisorRules: AdvisorRule[] = [
  {
    id: "audit-difficulte",
    priority: 100,
    when: { stages: ["difficulte"] },
    recommend: "audit",
    reasonKey: "Advisor.reasons.difficulte",
  },
  {
    id: "audit-conseil",
    priority: 95,
    when: { projectTypes: ["conseil"] },
    recommend: "audit",
    reasonKey: "Advisor.reasons.conseil",
  },
  {
    id: "audit-reprendre",
    priority: 90,
    when: { goals: ["reprendre"] },
    recommend: "audit",
    reasonKey: "Advisor.reasons.reprendre",
  },
  {
    id: "ia",
    priority: 85,
    when: { projectTypes: ["ia"] },
    recommend: "automatisation",
    reasonKey: "Advisor.reasons.ia",
  },
  {
    id: "automatiser",
    priority: 84,
    when: { goals: ["automatiser"] },
    recommend: "automatisation",
    reasonKey: "Advisor.reasons.automatiser",
  },
  {
    id: "cloud",
    priority: 80,
    when: { projectTypes: ["cloud"] },
    recommend: "fiabilisation",
    reasonKey: "Advisor.reasons.cloud",
  },
  {
    id: "fiabiliser",
    priority: 79,
    when: { goals: ["fiabiliser"] },
    recommend: "fiabilisation",
    reasonKey: "Advisor.reasons.fiabiliser",
  },
  {
    id: "api",
    priority: 75,
    when: { projectTypes: ["api"] },
    recommend: "api",
    reasonKey: "Advisor.reasons.api",
  },
  {
    id: "existant",
    priority: 72,
    when: { stages: ["existant"] },
    recommend: "evolution",
    reasonKey: "Advisor.reasons.existant",
  },
  {
    id: "idee",
    priority: 70,
    when: { stages: ["idee"] },
    recommend: "cadrage",
    reasonKey: "Advisor.reasons.idee",
  },
  {
    id: "formation",
    priority: 68,
    when: { goals: ["former"] },
    recommend: "cadrage",
    reasonKey: "Advisor.reasons.formation",
  },
  {
    id: "budget-limite",
    priority: 65,
    when: { budgets: ["limite"] },
    recommend: "cadrage",
    reasonKey: "Advisor.reasons.budgetLimite",
  },
  {
    id: "plateforme",
    priority: 60,
    when: { projectTypes: ["app"], budgets: ["confortable"] },
    recommend: "plateforme",
    reasonKey: "Advisor.reasons.plateforme",
  },
  {
    id: "delai-cadre",
    priority: 58,
    when: { stages: ["cadre"], constraintsAny: ["delai"] },
    recommend: "mvp",
    reasonKey: "Advisor.reasons.delai",
  },
  {
    id: "site-vendre",
    priority: 55,
    when: { projectTypes: ["site"], goals: ["vendre"] },
    recommend: "mvp",
    reasonKey: "Advisor.reasons.siteVendre",
  },
  {
    id: "app-cadre",
    priority: 52,
    when: { projectTypes: ["app"], stages: ["cadre"] },
    recommend: "mvp",
    reasonKey: "Advisor.reasons.appCadre",
  },
  {
    id: "site-cadre",
    priority: 50,
    when: { projectTypes: ["site"], stages: ["cadre"] },
    recommend: "mvp",
    reasonKey: "Advisor.reasons.siteCadre",
  },
  {
    id: "fallback",
    priority: 0,
    when: {},
    recommend: "cadrage",
    reasonKey: "Advisor.reasons.fallback",
  },
];

export const advisorConfig: AdvisorConfig = {
  version: "2026-11-06",
  maxDurationWeeks: 32,
  fallbackApproach: "cadrage",
  fallbackReasonKey: "Advisor.reasons.fallback",
  approaches: advisorApproaches,
  constraintModifiers: advisorConstraintModifiers,
  rules: advisorRules,
};
