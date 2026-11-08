import {
  COMPLEXITY_LEVELS,
  CONSTRAINT_IDS,
  SERVICE_IDS,
  URGENCY_LEVELS,
  type AppliedFactors,
  type ConstraintId,
  type PendingNumber,
  type PricingAssumption,
  type PricingConfig,
  type PricingInput,
  type PricingLine,
  type PricingRange,
  type PricingResult,
  type PricingService,
} from "./types";

export type PricingInputErrorCode =
  | "unknown-service"
  | "unknown-feature"
  | "duplicate-feature"
  | "unknown-constraint"
  | "duplicate-constraint"
  | "unknown-complexity"
  | "unknown-urgency";

export class PricingConfigError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Configuration d’estimation invalide : ${issues.join(" ; ")}`);
    this.name = "PricingConfigError";
    this.issues = issues;
  }
}

export class PricingInputError extends Error {
  readonly code: PricingInputErrorCode;

  constructor(code: PricingInputErrorCode, message: string) {
    super(message);
    this.name = "PricingInputError";
    this.code = code;
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isFraction(value: number): boolean {
  return value >= 0 && value <= 1;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumNumbers(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Vérifie la structure de la configuration. Les valeurs `null` sont acceptées :
 * elles représentent des données client non encore fournies, jamais un défaut.
 */
export function validatePricingConfig(config: PricingConfig): string[] {
  const issues: string[] = [];

  if (!config.version.trim()) {
    issues.push("version : identifiant requis");
  }

  if (config.currency !== "EUR") {
    issues.push("currency : seule la devise EUR est supportée");
  }

  if (!isFiniteNumber(config.roundingStep) || config.roundingStep <= 0) {
    issues.push("roundingStep : nombre strictement positif requis");
  }

  if (!isFiniteNumber(config.dayRounding) || config.dayRounding <= 0) {
    issues.push("dayRounding : nombre strictement positif requis");
  }

  if (!isFiniteNumber(config.workingDaysPerWeek) || config.workingDaysPerWeek <= 0) {
    issues.push("workingDaysPerWeek : nombre strictement positif requis");
  }

  if (
    config.riskMarginRate !== null &&
    (!isFiniteNumber(config.riskMarginRate) || !isFraction(config.riskMarginRate))
  ) {
    issues.push("riskMarginRate : valeur entre 0 et 1 ou null requise");
  }

  if (
    config.rangeSpread !== null &&
    (!isFiniteNumber(config.rangeSpread) || !isFraction(config.rangeSpread))
  ) {
    issues.push("rangeSpread : valeur entre 0 et 1 ou null requise");
  }

  const { regime, rate } = config.vat;

  if (regime !== null && regime !== "franchise" && regime !== "standard") {
    issues.push("vat.regime : franchise, standard ou null requis");
  }

  if (rate !== null && (!isFiniteNumber(rate) || !isFraction(rate))) {
    issues.push("vat.rate : valeur entre 0 et 1 ou null requise");
  }

  if (regime === null && rate !== null) {
    issues.push("vat.rate : doit rester null tant que le régime n’est pas choisi");
  }

  if (regime === "franchise" && rate !== 0) {
    issues.push("vat.rate : doit valoir 0 en franchise de TVA");
  }

  if (regime === "standard" && (rate === null || rate <= 0)) {
    issues.push("vat.rate : taux strictement positif requis en régime standard");
  }

  for (const level of COMPLEXITY_LEVELS) {
    const factor = config.complexityFactors?.[level];

    if (factor === undefined) {
      issues.push(`complexityFactors.${level} : coefficient manquant`);
    } else if (factor !== null && (!isFiniteNumber(factor) || factor <= 0)) {
      issues.push(`complexityFactors.${level} : nombre strictement positif ou null requis`);
    }
  }

  for (const level of URGENCY_LEVELS) {
    const factor = config.urgencyFactors?.[level];

    if (factor === undefined) {
      issues.push(`urgencyFactors.${level} : coefficient manquant`);
    } else if (factor !== null && (!isFiniteNumber(factor) || factor <= 0)) {
      issues.push(`urgencyFactors.${level} : nombre strictement positif ou null requis`);
    }
  }

  for (const serviceId of SERVICE_IDS) {
    const service = config.services?.[serviceId] as PricingService | undefined;

    if (!service) {
      issues.push(`services.${serviceId} : service manquant`);
      continue;
    }

    if (!service.labelKey.trim()) {
      issues.push(`services.${serviceId}.labelKey : clé i18n requise`);
    }

    if (
      service.dailyRate !== null &&
      (!isFiniteNumber(service.dailyRate) || service.dailyRate <= 0)
    ) {
      issues.push(`services.${serviceId}.dailyRate : nombre strictement positif ou null requis`);
    }

    if (service.baseDays !== null && (!isFiniteNumber(service.baseDays) || service.baseDays < 0)) {
      issues.push(`services.${serviceId}.baseDays : nombre positif ou nul, ou null requis`);
    }

    if (!Array.isArray(service.features)) {
      issues.push(`services.${serviceId}.features : tableau requis`);
      continue;
    }

    const featureIds = new Set<string>();

    for (const feature of service.features) {
      if (!feature.id.trim()) {
        issues.push(`services.${serviceId}.features : identifiant requis`);
        continue;
      }

      if (featureIds.has(feature.id)) {
        issues.push(`services.${serviceId}.features.${feature.id} : identifiant dupliqué`);
      }
      featureIds.add(feature.id);

      if (!feature.labelKey.trim()) {
        issues.push(`services.${serviceId}.features.${feature.id}.labelKey : clé i18n requise`);
      }

      if (feature.days !== null && (!isFiniteNumber(feature.days) || feature.days < 0)) {
        issues.push(
          `services.${serviceId}.features.${feature.id}.days : nombre positif ou nul, ou null requis`,
        );
      }
    }
  }

  if (!Array.isArray(config.constraints)) {
    issues.push("constraints : tableau requis");
  } else {
    for (const constraintId of CONSTRAINT_IDS) {
      const matches = config.constraints.filter((constraint) => constraint.id === constraintId);

      if (matches.length === 0) {
        issues.push(`constraints.${constraintId} : contrainte manquante`);
      }
      if (matches.length > 1) {
        issues.push(`constraints.${constraintId} : contrainte dupliquée`);
      }
    }

    for (const constraint of config.constraints) {
      if (!(CONSTRAINT_IDS as readonly string[]).includes(constraint.id)) {
        issues.push(`constraints.${String(constraint.id)} : identifiant inconnu`);
      }

      if (!constraint.labelKey.trim()) {
        issues.push(`constraints.${constraint.id}.labelKey : clé i18n requise`);
      }

      if (constraint.days !== null && (!isFiniteNumber(constraint.days) || constraint.days < 0)) {
        issues.push(`constraints.${constraint.id}.days : nombre positif ou nul, ou null requis`);
      }
    }
  }

  if (!Array.isArray(config.fees)) {
    issues.push("fees : tableau requis");
  } else {
    const feeIds = new Set<string>();

    for (const fee of config.fees) {
      if (!fee.id.trim()) {
        issues.push("fees : identifiant requis");
        continue;
      }

      if (feeIds.has(fee.id)) {
        issues.push(`fees.${fee.id} : identifiant dupliqué`);
      }
      feeIds.add(fee.id);

      if (!fee.labelKey.trim()) {
        issues.push(`fees.${fee.id}.labelKey : clé i18n requise`);
      }

      if (fee.amount !== null && (!isFiniteNumber(fee.amount) || fee.amount < 0)) {
        issues.push(`fees.${fee.id}.amount : montant positif ou nul, ou null requis`);
      }

      if (fee.appliesTo !== "all") {
        if (!Array.isArray(fee.appliesTo) || fee.appliesTo.length === 0) {
          issues.push(`fees.${fee.id}.appliesTo : « all » ou liste de services requise`);
        } else {
          for (const serviceId of fee.appliesTo) {
            if (!(SERVICE_IDS as readonly string[]).includes(serviceId)) {
              issues.push(`fees.${fee.id}.appliesTo : service inconnu (${String(serviceId)})`);
            }
          }
        }
      }
    }
  }

  if (!Array.isArray(config.exclusions)) {
    issues.push("exclusions : tableau requis");
  }

  return issues;
}

/**
 * Liste toutes les valeurs client encore manquantes, indépendamment d’une
 * saisie utilisateur. Sert au tableau de bord de configuration et aux tests.
 */
export function getMissingConfigFields(config: PricingConfig): string[] {
  const missing = new Set<string>();

  if (config.vat.regime === null) {
    missing.add("vat.regime");
  }
  if (config.vat.regime === "standard" && config.vat.rate === null) {
    missing.add("vat.rate");
  }

  if (config.riskMarginRate === null) {
    missing.add("riskMarginRate");
  }
  if (config.rangeSpread === null) {
    missing.add("rangeSpread");
  }

  for (const level of COMPLEXITY_LEVELS) {
    if (config.complexityFactors?.[level] === null) {
      missing.add(`complexityFactors.${level}`);
    }
  }

  for (const level of URGENCY_LEVELS) {
    if (config.urgencyFactors?.[level] === null) {
      missing.add(`urgencyFactors.${level}`);
    }
  }

  for (const serviceId of SERVICE_IDS) {
    const service = config.services?.[serviceId];

    if (!service) {
      missing.add(`services.${serviceId}`);
      continue;
    }

    if (service.dailyRate === null) {
      missing.add(`services.${serviceId}.dailyRate`);
    }
    if (service.baseDays === null) {
      missing.add(`services.${serviceId}.baseDays`);
    }

    for (const feature of service.features ?? []) {
      if (feature.days === null) {
        missing.add(`services.${serviceId}.features.${feature.id}.days`);
      }
    }
  }

  for (const constraint of config.constraints ?? []) {
    if (constraint.days === null) {
      missing.add(`constraints.${constraint.id}.days`);
    }
  }

  for (const fee of config.fees ?? []) {
    if (fee.amount === null) {
      missing.add(`fees.${fee.id}.amount`);
    }
  }

  return Array.from(missing).sort();
}

function buildDayLine(
  input: {
    id: string;
    ruleId: string;
    kind: "base" | "feature" | "constraint";
    labelKey: string;
    rawDays: PendingNumber;
    factors: AppliedFactors;
    params: Record<string, number | string | boolean | null>;
  },
  dayRounding: number,
  dailyRate: PendingNumber,
): PricingLine {
  const { complexity, urgency } = input.factors;
  const days =
    input.rawDays === null || complexity === null || urgency === null
      ? null
      : roundTo(input.rawDays * complexity * urgency, dayRounding);
  const amountHT = days === null || dailyRate === null ? null : roundMoney(days * dailyRate);

  return {
    id: input.id,
    ruleId: input.ruleId,
    kind: input.kind,
    labelKey: input.labelKey,
    rawDays: input.rawDays,
    days,
    unitAmount: dailyRate,
    amountHT,
    factors: input.factors,
    params: {
      ...input.params,
      complexityFactor: complexity,
      urgencyFactor: urgency,
    },
  };
}

function buildAssumptions(config: PricingConfig): PricingAssumption[] {
  const assumptions: PricingAssumption[] = [
    {
      id: "assumption.workingDaysPerWeek",
      params: { days: config.workingDaysPerWeek },
    },
    {
      id: "assumption.roundingStep",
      params: { amount: config.roundingStep },
    },
    {
      id: "assumption.dayRounding",
      params: { days: config.dayRounding },
    },
  ];

  if (config.riskMarginRate !== null) {
    assumptions.push({
      id: "assumption.riskMargin",
      params: { percent: config.riskMarginRate },
    });
  }

  if (config.rangeSpread !== null) {
    assumptions.push({
      id: "assumption.rangeSpread",
      params: { percent: config.rangeSpread },
    });
  }

  if (config.vat.regime !== null) {
    assumptions.push({
      id: "assumption.vatRegime",
      params: { regime: config.vat.regime },
    });
  }

  return assumptions;
}

/**
 * Calcule une estimation à partir d’une configuration et d’une saisie.
 *
 * Le moteur ne lève jamais d’exception pour une valeur métier manquante : il
 * renvoie `status: "pending-config"` et la liste `missingConfig`. Il lève en
 * revanche une erreur pour une configuration structurellement invalide ou une
 * saisie incohérente (feature inconnue, doublon, etc.).
 */
export function computeEstimate(config: PricingConfig, input: PricingInput): PricingResult {
  const issues = validatePricingConfig(config);

  if (issues.length > 0) {
    throw new PricingConfigError(issues);
  }

  const service = config.services?.[input.service] as PricingService | undefined;

  if (!service) {
    throw new PricingInputError("unknown-service", `Service inconnu : ${String(input.service)}`);
  }

  const complexityFactor = config.complexityFactors?.[input.complexity];

  if (complexityFactor === undefined) {
    throw new PricingInputError(
      "unknown-complexity",
      `Complexité inconnue : ${String(input.complexity)}`,
    );
  }

  const urgencyFactor = config.urgencyFactors?.[input.urgency];

  if (urgencyFactor === undefined) {
    throw new PricingInputError("unknown-urgency", `Urgence inconnue : ${String(input.urgency)}`);
  }

  if (new Set(input.features).size !== input.features.length) {
    throw new PricingInputError(
      "duplicate-feature",
      "Une option de périmètre est présente plusieurs fois.",
    );
  }

  if (new Set(input.constraints).size !== input.constraints.length) {
    throw new PricingInputError(
      "duplicate-constraint",
      "Une contrainte est présente plusieurs fois.",
    );
  }

  const selectedFeatureIds = new Set(input.features);
  const selectedFeatures = service.features.filter((feature) => selectedFeatureIds.has(feature.id));

  for (const featureId of input.features) {
    if (!selectedFeatures.some((feature) => feature.id === featureId)) {
      throw new PricingInputError(
        "unknown-feature",
        `Option inconnue pour ${input.service} : ${featureId}`,
      );
    }
  }

  const selectedConstraintIds = new Set<ConstraintId>(input.constraints);
  const selectedConstraints = (config.constraints ?? []).filter((constraint) =>
    selectedConstraintIds.has(constraint.id),
  );

  for (const constraintId of input.constraints) {
    if (!selectedConstraints.some((constraint) => constraint.id === constraintId)) {
      throw new PricingInputError("unknown-constraint", `Contrainte inconnue : ${constraintId}`);
    }
  }

  const missing = new Set<string>();
  const factors: AppliedFactors = { complexity: complexityFactor, urgency: urgencyFactor };
  const dayLines: PricingLine[] = [];
  const feeLines: PricingLine[] = [];

  if (service.dailyRate === null) {
    missing.add(`services.${input.service}.dailyRate`);
  }
  if (service.baseDays === null) {
    missing.add(`services.${input.service}.baseDays`);
  }
  if (complexityFactor === null) {
    missing.add(`complexityFactors.${input.complexity}`);
  }
  if (urgencyFactor === null) {
    missing.add(`urgencyFactors.${input.urgency}`);
  }

  dayLines.push(
    buildDayLine(
      {
        id: `base:${input.service}`,
        ruleId: "service.base",
        kind: "base",
        labelKey: service.labelKey,
        rawDays: service.baseDays,
        factors,
        params: {
          service: input.service,
          complexity: input.complexity,
          urgency: input.urgency,
        },
      },
      config.dayRounding,
      service.dailyRate,
    ),
  );

  for (const feature of selectedFeatures) {
    if (feature.days === null) {
      missing.add(`services.${input.service}.features.${feature.id}.days`);
    }

    dayLines.push(
      buildDayLine(
        {
          id: `feature:${feature.id}`,
          ruleId: `feature.${feature.id}`,
          kind: "feature",
          labelKey: feature.labelKey,
          rawDays: feature.days,
          factors,
          params: { service: input.service, feature: feature.id },
        },
        config.dayRounding,
        service.dailyRate,
      ),
    );
  }

  for (const constraint of selectedConstraints) {
    if (constraint.days === null) {
      missing.add(`constraints.${constraint.id}.days`);
    }

    dayLines.push(
      buildDayLine(
        {
          id: `constraint:${constraint.id}`,
          ruleId: `constraint.${constraint.id}`,
          kind: "constraint",
          labelKey: constraint.labelKey,
          rawDays: constraint.days,
          factors,
          params: { service: input.service, constraint: constraint.id },
        },
        config.dayRounding,
        service.dailyRate,
      ),
    );
  }

  const applicableFees = (config.fees ?? []).filter(
    (fee) => fee.appliesTo === "all" || fee.appliesTo.includes(input.service),
  );

  for (const fee of applicableFees) {
    if (fee.amount === null) {
      missing.add(`fees.${fee.id}.amount`);
    }

    feeLines.push({
      id: `fee:${fee.id}`,
      ruleId: `fee.${fee.id}`,
      kind: "fee",
      labelKey: fee.labelKey,
      rawDays: 0,
      days: 0,
      unitAmount: fee.amount,
      amountHT: fee.amount,
      factors: null,
      params: { service: input.service, amount: fee.amount },
    });
  }

  const totalDays =
    dayLines.length === 0 || dayLines.some((line) => line.days === null)
      ? null
      : roundTo(sumNumbers(dayLines.map((line) => line.days as number)), config.dayRounding);

  const billableLines = [...dayLines, ...feeLines];
  const subtotalHT = billableLines.some((line) => line.amountHT === null)
    ? null
    : roundMoney(sumNumbers(billableLines.map((line) => line.amountHT as number)));

  if (config.riskMarginRate === null) {
    missing.add("riskMarginRate");
  }

  const riskMarginHT =
    subtotalHT === null || config.riskMarginRate === null
      ? null
      : roundMoney(subtotalHT * config.riskMarginRate);

  const riskLine: PricingLine = {
    id: "risk:margin",
    ruleId: "risk.margin",
    kind: "risk",
    labelKey: "EstimatePricing.lines.riskMargin",
    rawDays: null,
    days: null,
    unitAmount: null,
    amountHT: riskMarginHT,
    factors: null,
    params: { rate: config.riskMarginRate, base: subtotalHT },
  };

  const rawTotalHT =
    subtotalHT === null || riskMarginHT === null ? null : roundMoney(subtotalHT + riskMarginHT);
  const totalHT = rawTotalHT === null ? null : roundTo(rawTotalHT, config.roundingStep);
  const roundingAdjustment =
    totalHT === null || rawTotalHT === null ? null : roundMoney(totalHT - rawTotalHT);

  const lines = [...dayLines, ...feeLines, riskLine];

  if (roundingAdjustment !== null && roundingAdjustment !== 0) {
    lines.push({
      id: "rounding:total",
      ruleId: "total.rounding",
      kind: "rounding",
      labelKey: "EstimatePricing.lines.rounding",
      rawDays: null,
      days: null,
      unitAmount: null,
      amountHT: roundingAdjustment,
      factors: null,
      params: { step: config.roundingStep, rawTotal: rawTotalHT },
    });
  }

  if (config.vat.regime === null) {
    missing.add("vat.regime");
  }

  if (config.vat.regime === "standard" && config.vat.rate === null) {
    missing.add("vat.rate");
  }

  let vatAmount: PendingNumber = null;

  if (totalHT !== null && config.vat.regime === "franchise") {
    vatAmount = 0;
  } else if (totalHT !== null && config.vat.regime === "standard" && config.vat.rate !== null) {
    vatAmount = roundMoney(totalHT * config.vat.rate);
  }

  const totalTTC = totalHT === null || vatAmount === null ? null : roundMoney(totalHT + vatAmount);

  if (config.rangeSpread === null) {
    missing.add("rangeSpread");
  }

  let rangeHT: PricingRange | null = null;

  if (totalHT !== null && config.rangeSpread !== null) {
    const min = roundTo(totalHT * (1 - config.rangeSpread), config.roundingStep);
    const max = roundTo(totalHT * (1 + config.rangeSpread), config.roundingStep);

    rangeHT = {
      min: Math.min(min, totalHT),
      max: Math.max(max, totalHT),
    };
  }

  let rangeTTC: PricingRange | null = null;

  if (rangeHT !== null && config.vat.regime === "franchise") {
    rangeTTC = { min: rangeHT.min, max: rangeHT.max };
  } else if (rangeHT !== null && config.vat.regime === "standard" && config.vat.rate !== null) {
    rangeTTC = {
      min: roundMoney(rangeHT.min * (1 + config.vat.rate)),
      max: roundMoney(rangeHT.max * (1 + config.vat.rate)),
    };
  }

  let durationWeeks: PricingResult["durationWeeks"] = null;

  if (totalDays !== null && config.rangeSpread !== null) {
    const minDays = totalDays * (1 - config.rangeSpread);
    const maxDays = totalDays * (1 + config.rangeSpread);
    const minWeeks = Math.max(1, Math.ceil(minDays / config.workingDaysPerWeek));
    const maxWeeks = Math.max(minWeeks, Math.ceil(maxDays / config.workingDaysPerWeek));

    durationWeeks = { min: minWeeks, max: maxWeeks };
  }

  /**
   * La TVA est un blocage distinct des valeurs HT : une grille complète sans
   * régime de TVA reste publiable en HT (`ready-ht`), sans TTC ni PDF.
   */
  const vatPending =
    config.vat.regime === null ||
    (config.vat.regime === "standard" && config.vat.rate === null);
  const missingHtValues = Array.from(missing).filter(
    (field) => field !== "vat.regime" && field !== "vat.rate",
  );

  const status: PricingResult["status"] =
    missingHtValues.length > 0 || totalHT === null || rangeHT === null
      ? "pending-config"
      : vatPending || totalTTC === null
        ? "ready-ht"
        : "ready";

  return {
    status,
    configVersion: config.version,
    currency: config.currency,
    service: input.service,
    lines,
    totalDays,
    subtotalHT,
    riskMarginHT,
    totalHT,
    vat: {
      regime: config.vat.regime,
      rate: config.vat.rate,
      amount: vatAmount,
      franchise: config.vat.regime === "franchise",
      mentionKey: config.vat.franchiseMentionKey,
    },
    totalTTC,
    rangeHT,
    rangeTTC,
    durationWeeks,
    assumptions: buildAssumptions(config),
    exclusions: [...config.exclusions],
    missingConfig: Array.from(missing).sort(),
  };
}
