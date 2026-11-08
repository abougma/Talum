import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
import { advisorConfig } from "../config";
import { computeAdvice } from "../engine";
import {
  ADVISOR_CONSTRAINTS,
  APPROACH_IDS,
  BUDGETS,
  GOALS,
  NEXT_STEP_IDS,
  PROJECT_TYPES,
  RISK_IDS,
  STAGES,
} from "../types";

function collectKeys(value: unknown, prefix = "", keys = new Set<string>()): Set<string> {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      collectKeys(child, prefix ? `${prefix}.${key}` : key, keys);
    }
  } else if (prefix) {
    keys.add(prefix);
  }

  return keys;
}

const frKeys = collectKeys(fr);
const enKeys = collectKeys(en);

const stepKeys = ["projectType", "goal", "stage", "constraints", "budget"] as const;

const result = computeAdvice(advisorConfig, {
  projectType: "site",
  goal: "lancer",
  stage: "cadre",
  constraints: ["securite"],
  budget: "a-definir",
});

const requiredKeys = [
  ...APPROACH_IDS.map((id) => `Advisor.approaches.${id}`),
  ...RISK_IDS.map((id) => `Advisor.risks.${id}`),
  ...NEXT_STEP_IDS.map((id) => `Advisor.nextSteps.${id}`),
  ...advisorConfig.rules.map((rule) => rule.reasonKey),
  ...Object.values(advisorConfig.approaches).flatMap((approach) => approach.stackKeys),
  ...result.assumptions,
  ...result.disclaimers,
  ...PROJECT_TYPES.map((id) => `AdvisorPage.projectTypes.${id}`),
  ...PROJECT_TYPES.map((id) => `AdvisorPage.projectTypeHints.${id}`),
  ...GOALS.map((id) => `AdvisorPage.goals.${id}`),
  ...GOALS.map((id) => `AdvisorPage.goalHints.${id}`),
  ...STAGES.map((id) => `AdvisorPage.stages.${id}`),
  ...STAGES.map((id) => `AdvisorPage.stageHints.${id}`),
  ...ADVISOR_CONSTRAINTS.map((id) => `AdvisorPage.constraints.${id}`),
  ...BUDGETS.map((id) => `AdvisorPage.budgets.${id}`),
  ...BUDGETS.map((id) => `AdvisorPage.budgetHints.${id}`),
  ...stepKeys.map((id) => `AdvisorPage.steps.${id}`),
  ...stepKeys.map((id) => `AdvisorPage.questions.${id}`),
  ...NEXT_STEP_IDS.map((id) => `AdvisorPage.nextStepCta.${id}`),
];

describe("messages de l’assistant Conseil", () => {
  it("maintient la parité des clés entre le français et l’anglais", () => {
    expect([...frKeys].sort()).toEqual([...enKeys].sort());
  });

  it("fournit chaque clé utilisée dynamiquement par l’assistant", () => {
    const missingFr = requiredKeys.filter((key) => !frKeys.has(key));
    const missingEn = requiredKeys.filter((key) => !enKeys.has(key));

    expect(missingFr).toEqual([]);
    expect(missingEn).toEqual([]);
  });
});
