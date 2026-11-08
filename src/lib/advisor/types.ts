import type { ExpertiseSlug } from "@/data/services";

export const PROJECT_TYPES = ["site", "app", "api", "cloud", "ia", "conseil"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const GOALS = [
  "lancer",
  "vendre",
  "fiabiliser",
  "automatiser",
  "reprendre",
  "former",
] as const;

export type Goal = (typeof GOALS)[number];

export const STAGES = ["idee", "cadre", "existant", "difficulte"] as const;

export type Stage = (typeof STAGES)[number];

export const ADVISOR_CONSTRAINTS = [
  "delai",
  "budget-limite",
  "securite",
  "conformite",
  "integration",
  "equipe-interne",
  "hebergement",
] as const;

export type AdvisorConstraintId = (typeof ADVISOR_CONSTRAINTS)[number];

export const BUDGETS = ["limite", "modere", "confortable", "a-definir"] as const;

export type Budget = (typeof BUDGETS)[number];

export const APPROACH_IDS = [
  "cadrage",
  "mvp",
  "plateforme",
  "api",
  "fiabilisation",
  "automatisation",
  "audit",
  "evolution",
] as const;

export type ApproachId = (typeof APPROACH_IDS)[number];

export const RISK_IDS = [
  "perimetre",
  "delai",
  "securite",
  "conformite",
  "integration",
  "budget",
  "transfert",
  "hebergement",
  "qualite",
  "donnees",
  "dependance",
  "regression",
  "dette",
  "complexite",
] as const;

export type RiskId = (typeof RISK_IDS)[number];

export const NEXT_STEP_IDS = ["contact", "cadrage", "audit"] as const;

export type NextStepId = (typeof NEXT_STEP_IDS)[number];

export type AdvisorAnswers = {
  projectType: ProjectType;
  goal: Goal;
  stage: Stage;
  constraints: AdvisorConstraintId[];
  budget: Budget;
};

export type AdvisorRule = {
  id: string;
  /** Plus la priorité est haute, plus la règle est évaluée tôt. */
  priority: number;
  when: {
    projectTypes?: ProjectType[];
    goals?: Goal[];
    stages?: Stage[];
    budgets?: Budget[];
    constraintsAny?: AdvisorConstraintId[];
    constraintsAll?: AdvisorConstraintId[];
  };
  recommend: ApproachId;
  /** Clé i18n expliquant pourquoi cette approche est proposée. */
  reasonKey: string;
};

export type AdvisorApproach = {
  serviceSlug: ExpertiseSlug;
  /** Durée indicative en semaines, avant contraintes. */
  durationWeeks: { min: number; max: number };
  /** Clés i18n des technologies ou méthodes affichées. */
  stackKeys: string[];
  riskIds: RiskId[];
  nextStepId: NextStepId;
};

export type AdvisorConstraintModifier = {
  riskId: RiskId;
  extraWeeks: number;
};

export type AdvisorConfig = {
  version: string;
  maxDurationWeeks: number;
  fallbackApproach: ApproachId;
  /** Clé i18n expliquant l’approche de repli. */
  fallbackReasonKey: string;
  approaches: Record<ApproachId, AdvisorApproach>;
  constraintModifiers: Record<AdvisorConstraintId, AdvisorConstraintModifier>;
  rules: AdvisorRule[];
};

export type AdvisorResult = {
  approach: ApproachId;
  serviceSlug: ExpertiseSlug;
  stackKeys: string[];
  durationWeeks: { min: number; max: number };
  risks: RiskId[];
  nextStepId: NextStepId;
  matchedRuleId: string;
  reasonKey: string;
  appliedConstraints: AdvisorConstraintId[];
  assumptions: string[];
  disclaimers: string[];
  configVersion: string;
};
