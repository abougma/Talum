/**
 * Types du moteur d'estimation.
 *
 * Le moteur est volontairement pur : aucun import React, aucune lecture
 * d'environnement, aucune horloge. Toutes les valeurs métier (TJM, jours,
 * coefficients, TVA) viennent de `PricingConfig`.
 */

export const SERVICE_IDS = [
  "web",
  "api",
  "cloud-devops",
  "gestion-de-projet",
  "ia",
  "conseil",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export const COMPLEXITY_LEVELS = ["simple", "standard", "avance", "complet"] as const;

export type ComplexityLevel = (typeof COMPLEXITY_LEVELS)[number];

export const URGENCY_LEVELS = ["standard", "confort", "prioritaire"] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const CONSTRAINT_IDS = [
  "securite",
  "conformite",
  "conformite-ia",
  "integration-existant",
  "hebergement",
  "maintenance",
] as const;

export type ConstraintId = (typeof CONSTRAINT_IDS)[number];

export type VatRegime = "franchise" | "standard";

/**
 * Un champ `null` signifie « valeur appartenant au client, pas encore fournie ».
 * Le moteur ne remplace jamais un `null` par une valeur par défaut.
 */
export type PendingNumber = number | null;

export type PricingFeature = {
  id: string;
  labelKey: string;
  days: PendingNumber;
};

export type PricingService = {
  labelKey: string;
  /** TJM HT en euros. */
  dailyRate: PendingNumber;
  /** Charge de base, en jours, avant coefficients. */
  baseDays: PendingNumber;
  features: PricingFeature[];
};

export type PricingConstraint = {
  id: ConstraintId;
  labelKey: string;
  /** Jours ajoutés lorsque la contrainte est retenue. */
  days: PendingNumber;
};

export type PricingFee = {
  id: string;
  labelKey: string;
  amount: PendingNumber;
  appliesTo: ServiceId[] | "all";
};

export type VatConfig = {
  regime: VatRegime | null;
  /** Taux en fraction (0.2 = 20 %). */
  rate: PendingNumber;
  franchiseMentionKey: string;
};

export type PricingConfig = {
  version: string;
  currency: "EUR";
  vat: VatConfig;
  /** Marge de risque en fraction (0.1 = 10 %). */
  riskMarginRate: PendingNumber;
  /** Amplitude de la fourchette en fraction (0.15 = ±15 %). */
  rangeSpread: PendingNumber;
  /** Arrondi des montants HT/TTC, en euros. */
  roundingStep: number;
  /** Arrondi des jours. */
  dayRounding: number;
  workingDaysPerWeek: number;
  complexityFactors: Record<ComplexityLevel, PendingNumber>;
  urgencyFactors: Record<UrgencyLevel, PendingNumber>;
  services: Record<ServiceId, PricingService>;
  constraints: PricingConstraint[];
  fees: PricingFee[];
  /** Clés i18n des éléments explicitement exclus du périmètre. */
  exclusions: string[];
};

export type PricingInput = {
  service: ServiceId;
  features: string[];
  constraints: ConstraintId[];
  complexity: ComplexityLevel;
  urgency: UrgencyLevel;
};

export type PricingLineKind = "base" | "feature" | "constraint" | "fee" | "risk" | "rounding";

export type AppliedFactors = {
  complexity: PendingNumber;
  urgency: PendingNumber;
};

/**
 * Une ligne du devis. `ruleId` identifie la règle de configuration qui l'a
 * produite ; `params` conserve les valeurs exactes utilisées pour le calcul.
 */
export type PricingLine = {
  id: string;
  ruleId: string;
  kind: PricingLineKind;
  labelKey: string;
  rawDays: PendingNumber;
  days: PendingNumber;
  unitAmount: PendingNumber;
  amountHT: PendingNumber;
  factors: AppliedFactors | null;
  params: Record<string, number | string | boolean | null>;
};

export type PricingAssumption = {
  id: string;
  params: Record<string, number | string>;
};

export type PricingVat = {
  regime: VatRegime | null;
  rate: PendingNumber;
  amount: PendingNumber;
  franchise: boolean;
  mentionKey: string;
};

export type PricingRange = {
  min: number;
  max: number;
};

export type PricingDuration = {
  min: number;
  max: number;
};

/**
 * `ready` : HT, TVA et TTC calculés.
 * `ready-ht` : HT complet, mais TVA non configurée (totaux TTC indisponibles).
 * `pending-config` : au moins une valeur HT manque, aucun montant n’est publié.
 */
export type PricingResultStatus = "ready" | "ready-ht" | "pending-config";

export type PricingResult = {
  status: PricingResultStatus;
  configVersion: string;
  currency: string;
  service: ServiceId;
  lines: PricingLine[];
  totalDays: PendingNumber;
  subtotalHT: PendingNumber;
  riskMarginHT: PendingNumber;
  totalHT: PendingNumber;
  vat: PricingVat;
  totalTTC: PendingNumber;
  rangeHT: PricingRange | null;
  rangeTTC: PricingRange | null;
  durationWeeks: PricingDuration | null;
  assumptions: PricingAssumption[];
  exclusions: string[];
  missingConfig: string[];
};
