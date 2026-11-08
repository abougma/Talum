import {
  ADVISOR_CONSTRAINTS,
  APPROACH_IDS,
  BUDGETS,
  GOALS,
  PROJECT_TYPES,
  NEXT_STEP_IDS,
  RISK_IDS,
  STAGES,
  type AdvisorAnswers,
  type AdvisorApproach,
  type AdvisorConfig,
  type AdvisorConstraintId,
  type AdvisorConstraintModifier,
  type AdvisorResult,
  type AdvisorRule,
  type RiskId,
} from "./types";

export type AdvisorInputErrorCode =
  | "unknown-project-type"
  | "unknown-goal"
  | "unknown-stage"
  | "unknown-budget"
  | "unknown-constraint"
  | "duplicate-constraint"
  | "invalid-constraints";

export class AdvisorConfigError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Configuration de conseil invalide : ${issues.join(" ; ")}`);
    this.name = "AdvisorConfigError";
    this.issues = issues;
  }
}

export class AdvisorInputError extends Error {
  readonly code: AdvisorInputErrorCode;

  constructor(code: AdvisorInputErrorCode, message: string) {
    super(message);
    this.name = "AdvisorInputError";
    this.code = code;
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPositiveInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value > 0;
}

function isOneOf<T extends string>(allowed: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function validateList<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: string[],
): void {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value) || value.length === 0) {
    issues.push(`${path} : liste non vide requise`);
    return;
  }

  const seen = new Set<string>();

  for (const item of value) {
    if (!isOneOf(allowed, item)) {
      issues.push(`${path} : valeur inconnue (${String(item)})`);
      continue;
    }

    if (seen.has(item)) {
      issues.push(`${path} : valeur dupliquée (${item})`);
    }
    seen.add(item);
  }
}

/**
 * Vérifie la structure de la configuration de l’assistant Conseil.
 *
 * Aucune règle ne contient de prix, de TVA ou de mention légale : la
 * configuration ne décrit que des approches, des durées indicatives et des
 * risques. Les durées et les priorités doivent rester des entiers positifs.
 */
export function validateAdvisorConfig(config: AdvisorConfig): string[] {
  const issues: string[] = [];

  if (typeof config.version !== "string" || !config.version.trim()) {
    issues.push("version : identifiant requis");
  }

  if (!isPositiveInteger(config.maxDurationWeeks)) {
    issues.push("maxDurationWeeks : entier strictement positif requis");
  }

  if (!isOneOf(APPROACH_IDS, config.fallbackApproach)) {
    issues.push("fallbackApproach : approche inconnue");
  }

  if (typeof config.fallbackReasonKey !== "string" || !config.fallbackReasonKey.trim()) {
    issues.push("fallbackReasonKey : clé i18n requise");
  }

  const approaches = config.approaches as
    Partial<Record<(typeof APPROACH_IDS)[number], AdvisorApproach>> | undefined;

  if (!approaches || typeof approaches !== "object") {
    issues.push("approaches : objet requis");
  } else {
    for (const approachId of APPROACH_IDS) {
      const approach = approaches[approachId];

      if (!approach) {
        issues.push(`approaches.${approachId} : approche manquante`);
        continue;
      }

      if (typeof approach.serviceSlug !== "string" || !approach.serviceSlug.trim()) {
        issues.push(`approaches.${approachId}.serviceSlug : identifiant requis`);
      }

      if (!approach.durationWeeks || typeof approach.durationWeeks !== "object") {
        issues.push(`approaches.${approachId}.durationWeeks : objet requis`);
      } else {
        const { min, max } = approach.durationWeeks;

        if (!isPositiveInteger(min)) {
          issues.push(
            `approaches.${approachId}.durationWeeks.min : entier strictement positif requis`,
          );
        }
        if (!isPositiveInteger(max)) {
          issues.push(
            `approaches.${approachId}.durationWeeks.max : entier strictement positif requis`,
          );
        }
        if (isPositiveInteger(min) && isPositiveInteger(max) && max < min) {
          issues.push(
            `approaches.${approachId}.durationWeeks : max doit être supérieur ou égal à min`,
          );
        }
      }

      if (!Array.isArray(approach.stackKeys) || approach.stackKeys.length === 0) {
        issues.push(`approaches.${approachId}.stackKeys : liste non vide requise`);
      } else {
        for (const stackKey of approach.stackKeys) {
          if (typeof stackKey !== "string" || !stackKey.trim()) {
            issues.push(`approaches.${approachId}.stackKeys : clé i18n vide`);
          }
        }
      }

      if (!Array.isArray(approach.riskIds) || approach.riskIds.length === 0) {
        issues.push(`approaches.${approachId}.riskIds : liste non vide requise`);
      } else {
        for (const riskId of approach.riskIds) {
          if (!isOneOf(RISK_IDS, riskId)) {
            issues.push(`approaches.${approachId}.riskIds : risque inconnu (${String(riskId)})`);
          }
        }
      }

      if (!isOneOf(NEXT_STEP_IDS, approach.nextStepId)) {
        issues.push(`approaches.${approachId}.nextStepId : étape inconnue`);
      }
    }
  }

  const modifiers = config.constraintModifiers as
    Partial<Record<AdvisorConstraintId, AdvisorConstraintModifier>> | undefined;

  if (!modifiers || typeof modifiers !== "object") {
    issues.push("constraintModifiers : objet requis");
  } else {
    for (const constraintId of ADVISOR_CONSTRAINTS) {
      const modifier = modifiers[constraintId];

      if (!modifier) {
        issues.push(`constraintModifiers.${constraintId} : modificateur manquant`);
        continue;
      }

      if (!isOneOf(RISK_IDS, modifier.riskId)) {
        issues.push(`constraintModifiers.${constraintId}.riskId : risque inconnu`);
      }

      if (
        !isFiniteNumber(modifier.extraWeeks) ||
        !Number.isInteger(modifier.extraWeeks) ||
        modifier.extraWeeks < 0
      ) {
        issues.push(
          `constraintModifiers.${constraintId}.extraWeeks : entier positif ou nul requis`,
        );
      }
    }
  }

  if (!Array.isArray(config.rules) || config.rules.length === 0) {
    issues.push("rules : au moins une règle est requise");
  } else {
    const ruleIds = new Set<string>();

    config.rules.forEach((rule: AdvisorRule, index: number) => {
      const prefix = `rules[${index}]`;

      if (typeof rule.id !== "string" || !rule.id.trim()) {
        issues.push(`${prefix}.id : identifiant requis`);
      } else {
        if (ruleIds.has(rule.id)) {
          issues.push(`${prefix}.id : identifiant dupliqué (${rule.id})`);
        }
        ruleIds.add(rule.id);
      }

      if (!isFiniteNumber(rule.priority)) {
        issues.push(`${prefix}.priority : nombre requis`);
      }

      if (!isOneOf(APPROACH_IDS, rule.recommend)) {
        issues.push(`${prefix}.recommend : approche inconnue`);
      }

      if (typeof rule.reasonKey !== "string" || !rule.reasonKey.trim()) {
        issues.push(`${prefix}.reasonKey : clé i18n requise`);
      }

      if (!rule.when || typeof rule.when !== "object") {
        issues.push(`${prefix}.when : objet requis`);
        return;
      }

      validateList(rule.when.projectTypes, PROJECT_TYPES, `${prefix}.when.projectTypes`, issues);
      validateList(rule.when.goals, GOALS, `${prefix}.when.goals`, issues);
      validateList(rule.when.stages, STAGES, `${prefix}.when.stages`, issues);
      validateList(rule.when.budgets, BUDGETS, `${prefix}.when.budgets`, issues);
      validateList(
        rule.when.constraintsAny,
        ADVISOR_CONSTRAINTS,
        `${prefix}.when.constraintsAny`,
        issues,
      );
      validateList(
        rule.when.constraintsAll,
        ADVISOR_CONSTRAINTS,
        `${prefix}.when.constraintsAll`,
        issues,
      );
    });
  }

  return issues;
}

function validateAnswers(answers: AdvisorAnswers): void {
  if (!isOneOf(PROJECT_TYPES, answers.projectType)) {
    throw new AdvisorInputError(
      "unknown-project-type",
      `Type de projet inconnu : ${String(answers.projectType)}`,
    );
  }

  if (!isOneOf(GOALS, answers.goal)) {
    throw new AdvisorInputError("unknown-goal", `Objectif inconnu : ${String(answers.goal)}`);
  }

  if (!isOneOf(STAGES, answers.stage)) {
    throw new AdvisorInputError("unknown-stage", `Étape inconnue : ${String(answers.stage)}`);
  }

  if (!isOneOf(BUDGETS, answers.budget)) {
    throw new AdvisorInputError("unknown-budget", `Budget inconnu : ${String(answers.budget)}`);
  }

  if (!Array.isArray(answers.constraints)) {
    throw new AdvisorInputError("invalid-constraints", "La liste des contraintes est invalide.");
  }

  const seen = new Set<string>();

  for (const constraint of answers.constraints) {
    if (!isOneOf(ADVISOR_CONSTRAINTS, constraint)) {
      throw new AdvisorInputError(
        "unknown-constraint",
        `Contrainte inconnue : ${String(constraint)}`,
      );
    }

    if (seen.has(constraint)) {
      throw new AdvisorInputError(
        "duplicate-constraint",
        `Contrainte présente plusieurs fois : ${constraint}`,
      );
    }
    seen.add(constraint);
  }
}

function matchesRule(rule: AdvisorRule, answers: AdvisorAnswers): boolean {
  const { when } = rule;
  const selectedConstraints = new Set(answers.constraints);

  if (when.projectTypes && !when.projectTypes.includes(answers.projectType)) {
    return false;
  }
  if (when.goals && !when.goals.includes(answers.goal)) {
    return false;
  }
  if (when.stages && !when.stages.includes(answers.stage)) {
    return false;
  }
  if (when.budgets && !when.budgets.includes(answers.budget)) {
    return false;
  }
  if (when.constraintsAny && !when.constraintsAny.some((id) => selectedConstraints.has(id))) {
    return false;
  }
  if (when.constraintsAll && !when.constraintsAll.every((id) => selectedConstraints.has(id))) {
    return false;
  }

  return true;
}

/**
 * Applique les règles de l’assistant Conseil à une saisie.
 *
 * Le résultat est déterministe : à réponses identiques, il renvoie toujours la
 * même approche, la même durée et les mêmes risques. Les contraintes sont
 * normalisées dans l’ordre de `ADVISOR_CONSTRAINTS`, quel que soit l’ordre de
 * saisie. Aucune valeur monétaire, fiscale ou juridique n’est calculée.
 */
export function computeAdvice(config: AdvisorConfig, answers: AdvisorAnswers): AdvisorResult {
  const issues = validateAdvisorConfig(config);

  if (issues.length > 0) {
    throw new AdvisorConfigError(issues);
  }

  validateAnswers(answers);

  const orderedRules = config.rules
    .map((rule, index) => ({ rule, index }))
    .sort((left, right) => right.rule.priority - left.rule.priority || left.index - right.index);

  const matchedRule = orderedRules.find(({ rule }) => matchesRule(rule, answers))?.rule;
  const approachId = matchedRule?.recommend ?? config.fallbackApproach;
  const approach = config.approaches[approachId];

  const selectedConstraints = new Set(answers.constraints);
  const appliedConstraints = ADVISOR_CONSTRAINTS.filter((id) => selectedConstraints.has(id));

  const extraWeeks = appliedConstraints.reduce(
    (total, constraintId) => total + config.constraintModifiers[constraintId].extraWeeks,
    0,
  );

  const durationMax = Math.min(approach.durationWeeks.max + extraWeeks, config.maxDurationWeeks);
  const durationMin = Math.min(approach.durationWeeks.min + extraWeeks, durationMax);

  const risks: RiskId[] = [];

  for (const riskId of approach.riskIds) {
    if (!risks.includes(riskId)) {
      risks.push(riskId);
    }
  }

  for (const constraintId of appliedConstraints) {
    const { riskId } = config.constraintModifiers[constraintId];

    if (!risks.includes(riskId)) {
      risks.push(riskId);
    }
  }

  const assumptions = [
    "Advisor.assumptions.answers",
    "Advisor.assumptions.duration",
    ...(appliedConstraints.length > 0 ? ["Advisor.assumptions.constraints"] : []),
    "Advisor.assumptions.noPrice",
    "Advisor.assumptions.config",
  ];

  const disclaimers = [
    "Advisor.disclaimers.noCommitment",
    "Advisor.disclaimers.humanValidation",
    "Advisor.disclaimers.rulesBased",
  ];

  return {
    approach: approachId,
    serviceSlug: approach.serviceSlug,
    stackKeys: [...approach.stackKeys],
    durationWeeks: { min: durationMin, max: durationMax },
    risks,
    nextStepId: approach.nextStepId,
    matchedRuleId: matchedRule?.id ?? "fallback",
    reasonKey: matchedRule?.reasonKey ?? config.fallbackReasonKey,
    appliedConstraints,
    assumptions,
    disclaimers,
    configVersion: config.version,
  };
}
