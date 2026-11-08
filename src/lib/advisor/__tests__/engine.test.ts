import { describe, expect, it } from "vitest";
import { advisorConfig } from "../config";
import { AdvisorInputError, computeAdvice, validateAdvisorConfig } from "../engine";
import type { AdvisorAnswers, AdvisorConfig } from "../types";

const baseAnswers: AdvisorAnswers = {
  projectType: "site",
  goal: "lancer",
  stage: "cadre",
  constraints: [],
  budget: "a-definir",
};

function answers(overrides: Partial<AdvisorAnswers> = {}): AdvisorAnswers {
  return { ...baseAnswers, ...overrides };
}

function cloneConfig(): AdvisorConfig {
  return JSON.parse(JSON.stringify(advisorConfig)) as AdvisorConfig;
}

function captureInputError(run: () => unknown): AdvisorInputError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(AdvisorInputError);
    return error as AdvisorInputError;
  }

  throw new Error("AdvisorInputError attendue, aucune erreur levée.");
}

describe("validateAdvisorConfig", () => {
  it("accepte la configuration publique", () => {
    expect(validateAdvisorConfig(advisorConfig)).toEqual([]);
  });

  it("signale une approche manquante", () => {
    const config = cloneConfig();
    delete (config.approaches as Partial<AdvisorConfig["approaches"]>).api;

    expect(validateAdvisorConfig(config)).toContain("approaches.api : approche manquante");
  });

  it("signale une durée incohérente", () => {
    const config = cloneConfig();
    config.approaches.mvp.durationWeeks = { min: 10, max: 4 };

    expect(validateAdvisorConfig(config)).toContain(
      "approaches.mvp.durationWeeks : max doit être supérieur ou égal à min",
    );
  });

  it("signale un risque inconnu dans une approche", () => {
    const config = cloneConfig();
    config.approaches.mvp.riskIds.push("inconnu" as never);

    expect(validateAdvisorConfig(config)).toContain(
      "approaches.mvp.riskIds : risque inconnu (inconnu)",
    );
  });

  it("signale un modificateur de contrainte négatif", () => {
    const config = cloneConfig();
    config.constraintModifiers.securite.extraWeeks = -1;

    expect(validateAdvisorConfig(config)).toContain(
      "constraintModifiers.securite.extraWeeks : entier positif ou nul requis",
    );
  });

  it("signale un identifiant de règle dupliqué", () => {
    const config = cloneConfig();
    config.rules[1].id = config.rules[0].id;

    expect(
      validateAdvisorConfig(config).some((issue) => issue.includes("identifiant dupliqué")),
    ).toBe(true);
  });

  it("signale une approche recommandée inconnue", () => {
    const config = cloneConfig();
    config.rules[0].recommend = "inconnue" as never;

    expect(validateAdvisorConfig(config)).toContain("rules[0].recommend : approche inconnue");
  });

  it("signale une liste de règles vide", () => {
    const config = cloneConfig();
    config.rules = [];

    expect(validateAdvisorConfig(config)).toContain("rules : au moins une règle est requise");
  });

  it("signale une clé de repli vide", () => {
    const config = cloneConfig();
    config.fallbackReasonKey = " ";

    expect(validateAdvisorConfig(config)).toContain("fallbackReasonKey : clé i18n requise");
  });
});

describe("computeAdvice — approche", () => {
  const cases: Array<{
    label: string;
    input: AdvisorAnswers;
    approach: string;
    ruleId: string;
  }> = [
    {
      label: "projet en difficulté → audit",
      input: answers({ stage: "difficulte" }),
      approach: "audit",
      ruleId: "audit-difficulte",
    },
    {
      label: "conseil explicite → audit",
      input: answers({ projectType: "conseil" }),
      approach: "audit",
      ruleId: "audit-conseil",
    },
    {
      label: "reprise d’existant → audit",
      input: answers({ goal: "reprendre" }),
      approach: "audit",
      ruleId: "audit-reprendre",
    },
    {
      label: "projet IA → automatisation",
      input: answers({ projectType: "ia" }),
      approach: "automatisation",
      ruleId: "ia",
    },
    {
      label: "objectif automatiser → automatisation",
      input: answers({ goal: "automatiser" }),
      approach: "automatisation",
      ruleId: "automatiser",
    },
    {
      label: "projet cloud → fiabilisation",
      input: answers({ projectType: "cloud" }),
      approach: "fiabilisation",
      ruleId: "cloud",
    },
    {
      label: "objectif fiabiliser → fiabilisation",
      input: answers({ goal: "fiabiliser" }),
      approach: "fiabilisation",
      ruleId: "fiabiliser",
    },
    {
      label: "projet API → API",
      input: answers({ projectType: "api" }),
      approach: "api",
      ruleId: "api",
    },
    {
      label: "produit existant → évolution",
      input: answers({ stage: "existant" }),
      approach: "evolution",
      ruleId: "existant",
    },
    {
      label: "idée → cadrage",
      input: answers({ stage: "idee" }),
      approach: "cadrage",
      ruleId: "idee",
    },
    {
      label: "objectif former → cadrage",
      input: answers({ goal: "former" }),
      approach: "cadrage",
      ruleId: "formation",
    },
    {
      label: "budget limité → cadrage",
      input: answers({ budget: "limite" }),
      approach: "cadrage",
      ruleId: "budget-limite",
    },
    {
      label: "application confortable → plateforme",
      input: answers({ projectType: "app", budget: "confortable" }),
      approach: "plateforme",
      ruleId: "plateforme",
    },
    {
      label: "besoin cadré avec délai → MVP",
      input: answers({ constraints: ["delai"] }),
      approach: "mvp",
      ruleId: "delai-cadre",
    },
    {
      label: "site pour vendre → MVP",
      input: answers({ goal: "vendre" }),
      approach: "mvp",
      ruleId: "site-vendre",
    },
    {
      label: "application cadrée → MVP",
      input: answers({ projectType: "app" }),
      approach: "mvp",
      ruleId: "app-cadre",
    },
    {
      label: "site cadré → MVP",
      input: answers(),
      approach: "mvp",
      ruleId: "site-cadre",
    },
  ];

  for (const testCase of cases) {
    it(testCase.label, () => {
      const result = computeAdvice(advisorConfig, testCase.input);

      expect(result.approach).toBe(testCase.approach);
      expect(result.matchedRuleId).toBe(testCase.ruleId);
    });
  }

  it("respecte la priorité la plus haute quand plusieurs règles correspondent", () => {
    const result = computeAdvice(
      advisorConfig,
      answers({ projectType: "conseil", stage: "difficulte", goal: "reprendre" }),
    );

    expect(result.matchedRuleId).toBe("audit-difficulte");
    expect(result.approach).toBe("audit");
  });

  it("utilise l’approche de repli si aucune règle ne correspond", () => {
    const config = cloneConfig();
    config.rules = [
      {
        id: "api-seulement",
        priority: 10,
        when: { projectTypes: ["api"] },
        recommend: "api",
        reasonKey: "Advisor.reasons.api",
      },
    ];
    config.fallbackApproach = "cadrage";
    config.fallbackReasonKey = "Advisor.reasons.fallback";

    const result = computeAdvice(config, baseAnswers);

    expect(result.approach).toBe("cadrage");
    expect(result.matchedRuleId).toBe("fallback");
    expect(result.reasonKey).toBe("Advisor.reasons.fallback");
  });
});

describe("computeAdvice — contraintes et durée", () => {
  it("ajoute les semaines des contraintes et les risques associés", () => {
    const result = computeAdvice(
      advisorConfig,
      answers({ constraints: ["securite", "conformite", "integration"] }),
    );

    expect(result.approach).toBe("mvp");
    expect(result.durationWeeks).toEqual({ min: 10, max: 14 });
    expect(result.appliedConstraints).toEqual(["securite", "conformite", "integration"]);
    expect(result.risks).toEqual(["perimetre", "delai", "securite", "conformite", "integration"]);
    expect(result.assumptions).toContain("Advisor.assumptions.constraints");
  });

  it("ajoute un risque sans allonger la durée quand la contrainte n’ajoute pas de semaines", () => {
    const result = computeAdvice(advisorConfig, answers({ constraints: ["budget-limite"] }));

    expect(result.durationWeeks).toEqual({ min: 6, max: 10 });
    expect(result.risks).toContain("budget");
    expect(result.appliedConstraints).toEqual(["budget-limite"]);
  });

  it("normalise l’ordre des contraintes et reste déterministe", () => {
    const first = computeAdvice(
      advisorConfig,
      answers({ constraints: ["integration", "securite"] }),
    );
    const second = computeAdvice(
      advisorConfig,
      answers({ constraints: ["securite", "integration"] }),
    );

    expect(first).toEqual(second);
    expect(first.appliedConstraints).toEqual(["securite", "integration"]);
  });

  it("plafonne la durée maximale sans dépasser le maximum configuré", () => {
    const config = cloneConfig();
    config.maxDurationWeeks = 10;

    const result = computeAdvice(config, answers({ constraints: ["integration"] }));

    expect(result.durationWeeks).toEqual({ min: 8, max: 10 });
  });

  it("ne modifie pas la durée sans contrainte", () => {
    const result = computeAdvice(advisorConfig, answers());

    expect(result.durationWeeks).toEqual({ min: 6, max: 10 });
    expect(result.appliedConstraints).toEqual([]);
    expect(result.assumptions).not.toContain("Advisor.assumptions.constraints");
  });
});

describe("computeAdvice — traçabilité", () => {
  it("renvoie la règle, la version de configuration et les textes de prudence", () => {
    const result = computeAdvice(advisorConfig, answers());

    expect(result.matchedRuleId).toBe("site-cadre");
    expect(result.configVersion).toBe(advisorConfig.version);
    expect(result.serviceSlug).toBe("developpement");
    expect(result.nextStepId).toBe("cadrage");
    expect(result.stackKeys.length).toBeGreaterThan(0);
    expect(result.assumptions).toEqual([
      "Advisor.assumptions.answers",
      "Advisor.assumptions.duration",
      "Advisor.assumptions.noPrice",
      "Advisor.assumptions.config",
    ]);
    expect(result.disclaimers).toEqual([
      "Advisor.disclaimers.noCommitment",
      "Advisor.disclaimers.humanValidation",
      "Advisor.disclaimers.rulesBased",
    ]);
  });

  it("ne produit aucun montant, taux ou donnée légale", () => {
    const result = computeAdvice(advisorConfig, answers());

    expect(Object.keys(result)).not.toContain("price");
    expect(Object.keys(result)).not.toContain("vat");
    expect(JSON.stringify(result)).not.toMatch(/€|EUR|TVA|SIRET/i);
  });
});

describe("computeAdvice — saisie invalide", () => {
  it("refuse un type de projet inconnu", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ projectType: "inconnu" as never })),
    );

    expect(error.code).toBe("unknown-project-type");
  });

  it("refuse un objectif inconnu", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ goal: "inconnu" as never })),
    );

    expect(error.code).toBe("unknown-goal");
  });

  it("refuse une étape inconnue", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ stage: "inconnu" as never })),
    );

    expect(error.code).toBe("unknown-stage");
  });

  it("refuse un budget inconnu", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ budget: "inconnu" as never })),
    );

    expect(error.code).toBe("unknown-budget");
  });

  it("refuse une contrainte inconnue", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ constraints: ["inconnu" as never] })),
    );

    expect(error.code).toBe("unknown-constraint");
  });

  it("refuse une contrainte dupliquée", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ constraints: ["securite", "securite"] })),
    );

    expect(error.code).toBe("duplicate-constraint");
  });

  it("refuse une liste de contraintes non valide", () => {
    const error = captureInputError(() =>
      computeAdvice(advisorConfig, answers({ constraints: "securite" as never })),
    );

    expect(error.code).toBe("invalid-constraints");
  });
});
