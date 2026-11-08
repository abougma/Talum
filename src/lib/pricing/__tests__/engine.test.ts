import { describe, expect, it } from "vitest";
import {
  computeEstimate,
  getMissingConfigFields,
  PricingInputError,
  validatePricingConfig,
} from "../engine";
import {
  SERVICE_IDS,
  type ComplexityLevel,
  type ConstraintId,
  type PricingConfig,
  type PricingInput,
  type ServiceId,
  type UrgencyLevel,
} from "../types";
import { fixtureConfig } from "./fixtures";

const nominalInput: PricingInput = {
  service: "web",
  features: ["pages", "authentification"],
  constraints: ["securite"],
  complexity: "avance",
  urgency: "confort",
};

function captureInputError(run: () => unknown): PricingInputError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(PricingInputError);
    return error as PricingInputError;
  }

  throw new Error("PricingInputError attendue, aucune erreur levée.");
}

describe("computeEstimate — cas nominal", () => {
  const result = computeEstimate(fixtureConfig, nominalInput);

  it("calcule les jours, le HT, la TVA, le TTC et la fourchette", () => {
    expect(result.status).toBe("ready");
    expect(result.service).toBe("web");
    expect(result.totalDays).toBe(27.5);
    expect(result.subtotalHT).toBe(19200);
    expect(result.riskMarginHT).toBe(1920);
    expect(result.totalHT).toBe(21100);
    expect(result.vat.rate).toBe(0.2);
    expect(result.vat.amount).toBe(4220);
    expect(result.totalTTC).toBe(25320);
    expect(result.rangeHT).toEqual({ min: 17950, max: 24250 });
    expect(result.rangeTTC).toEqual({ min: 21540, max: 29100 });
    expect(result.durationWeeks).toEqual({ min: 5, max: 7 });
    expect(result.missingConfig).toEqual([]);
  });

  it("trace chaque ligne avec la règle et les facteurs appliqués", () => {
    expect(result.lines.map((line) => line.ruleId)).toEqual([
      "service.base",
      "feature.pages",
      "feature.authentification",
      "constraint.securite",
      "fee.cadrage",
      "fee.mise-en-production",
      "risk.margin",
      "total.rounding",
    ]);

    const baseLine = result.lines[0];
    expect(baseLine.rawDays).toBe(10);
    expect(baseLine.days).toBe(14);
    expect(baseLine.unitAmount).toBe(600);
    expect(baseLine.amountHT).toBe(8400);
    expect(baseLine.factors).toEqual({ complexity: 1.25, urgency: 1.1 });
    expect(baseLine.params).toMatchObject({
      service: "web",
      complexity: "avance",
      urgency: "confort",
      complexityFactor: 1.25,
      urgencyFactor: 1.1,
    });
  });

  it("applique les frais forfaitaires sans coefficients", () => {
    const feeLines = result.lines.filter((line) => line.kind === "fee");

    expect(feeLines).toHaveLength(2);
    expect(feeLines[0]).toMatchObject({ labelKey: "fixture.fee.cadrage", days: 0, amountHT: 1500 });
    expect(feeLines[1]).toMatchObject({
      labelKey: "fixture.fee.mise-en-production",
      amountHT: 1200,
    });
    expect(feeLines.every((line) => line.factors === null)).toBe(true);
  });

  it("fait correspondre la somme des lignes au total HT", () => {
    const sum = result.lines.reduce((total, line) => total + (line.amountHT ?? 0), 0);

    expect(sum).toBe(result.totalHT);
  });

  it("ajoute une ligne de marge de risque puis une ligne d’arrondi", () => {
    const riskLine = result.lines.find((line) => line.kind === "risk");
    const roundingLine = result.lines.find((line) => line.kind === "rounding");

    expect(riskLine).toMatchObject({ ruleId: "risk.margin", amountHT: 1920 });
    expect(riskLine?.params).toEqual({ rate: 0.1, base: 19200 });
    expect(roundingLine).toMatchObject({ ruleId: "total.rounding", amountHT: -20 });
    expect(roundingLine?.params).toEqual({ step: 50, rawTotal: 21120 });
  });

  it("n’inclut pas les options non sélectionnées", () => {
    const ruleIds = result.lines.map((line) => line.ruleId);

    expect(ruleIds).not.toContain("feature.paiement");
    expect(ruleIds).not.toContain("feature.back-office");
    expect(ruleIds).not.toContain("constraint.conformite");
  });

  it("est déterministe", () => {
    const second = computeEstimate(fixtureConfig, nominalInput);

    expect(second).toEqual(result);
  });

  it("fonctionne sans option ni contrainte", () => {
    const minimal = computeEstimate(fixtureConfig, {
      service: "web",
      features: [],
      constraints: [],
      complexity: "standard",
      urgency: "standard",
    });

    expect(minimal.status).toBe("ready");
    expect(minimal.totalDays).toBe(10);
    expect(minimal.subtotalHT).toBe(8700);
    expect(minimal.totalHT).toBe(9550);
    expect(minimal.totalTTC).toBe(11460);
    expect(minimal.durationWeeks).toEqual({ min: 2, max: 3 });
  });

  it("produit une estimation prête pour chaque service du catalogue", () => {
    for (const service of SERVICE_IDS) {
      const estimate = computeEstimate(fixtureConfig, {
        service,
        features: [],
        constraints: [],
        complexity: "standard",
        urgency: "standard",
      });

      expect(estimate.status, service).toBe("ready");
      expect(estimate.totalHT, service).not.toBeNull();
    }
  });
});

describe("TVA", () => {
  it("applique la franchise : TVA à zéro, TTC égal au HT", () => {
    const franchiseConfig: PricingConfig = {
      ...fixtureConfig,
      vat: { ...fixtureConfig.vat, regime: "franchise", rate: 0 },
    };
    const result = computeEstimate(franchiseConfig, nominalInput);

    expect(result.vat.regime).toBe("franchise");
    expect(result.vat.franchise).toBe(true);
    expect(result.vat.amount).toBe(0);
    expect(result.totalTTC).toBe(result.totalHT);
    expect(result.rangeTTC).toEqual(result.rangeHT);
  });

  it("applique le taux standard séparément du HT", () => {
    const result = computeEstimate(fixtureConfig, nominalInput);

    expect(result.vat.regime).toBe("standard");
    expect(result.vat.franchise).toBe(false);
    expect(result.vat.amount).toBe(4220);
    expect(result.totalTTC).toBe(25320);
  });
});

describe("configuration en attente", () => {
  const pendingConfig: PricingConfig = {
    ...fixtureConfig,
    vat: { ...fixtureConfig.vat, regime: null, rate: null },
    riskMarginRate: null,
    rangeSpread: null,
    complexityFactors: { simple: null, standard: null, avance: null, complet: null },
    urgencyFactors: { standard: null, confort: null, prioritaire: null },
    services: {
      ...fixtureConfig.services,
      web: {
        ...fixtureConfig.services.web,
        dailyRate: null,
        baseDays: null,
        features: fixtureConfig.services.web.features.map((feature) => ({
          ...feature,
          days: null,
        })),
      },
    },
    constraints: fixtureConfig.constraints.map((constraint) => ({ ...constraint, days: null })),
    fees: fixtureConfig.fees.map((fee) => ({ ...fee, amount: null })),
  };

  it("ne publie aucun prix avec une configuration incomplète", () => {
    const result = computeEstimate(pendingConfig, {
      service: "web",
      features: [],
      constraints: [],
      complexity: "standard",
      urgency: "standard",
    });

    expect(result.status).toBe("pending-config");
    expect(result.totalDays).toBeNull();
    expect(result.subtotalHT).toBeNull();
    expect(result.riskMarginHT).toBeNull();
    expect(result.totalHT).toBeNull();
    expect(result.vat.amount).toBeNull();
    expect(result.totalTTC).toBeNull();
    expect(result.rangeHT).toBeNull();
    expect(result.rangeTTC).toBeNull();
    expect(result.durationWeeks).toBeNull();
    expect(result.missingConfig).toEqual(
      expect.arrayContaining([
        "services.web.dailyRate",
        "services.web.baseDays",
        "complexityFactors.standard",
        "urgencyFactors.standard",
        "riskMarginRate",
        "rangeSpread",
        "vat.regime",
        "fees.cadrage.amount",
        "fees.mise-en-production.amount",
      ]),
    );
  });

  it("conserve des lignes traçables même sans montant", () => {
    const result = computeEstimate(pendingConfig, {
      service: "web",
      features: [],
      constraints: [],
      complexity: "standard",
      urgency: "standard",
    });

    expect(result.lines.map((line) => line.ruleId)).toEqual([
      "service.base",
      "fee.cadrage",
      "fee.mise-en-production",
      "risk.margin",
    ]);

    for (const line of result.lines) {
      expect(line.amountHT).toBeNull();
      expect(line.ruleId).toBeTruthy();
    }
  });

  it("ne produit jamais NaN dans les valeurs numériques", () => {
    const result = computeEstimate(pendingConfig, nominalInput);
    const values = [
      result.totalDays,
      result.subtotalHT,
      result.riskMarginHT,
      result.totalHT,
      result.vat.amount,
      result.totalTTC,
      result.rangeHT?.min,
      result.rangeHT?.max,
      result.rangeTTC?.min,
      result.rangeTTC?.max,
      result.durationWeeks?.min,
      result.durationWeeks?.max,
      ...result.lines.flatMap((line) => [line.rawDays, line.days, line.unitAmount, line.amountHT]),
    ];

    for (const value of values) {
      if (value !== null && value !== undefined) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });

  it("liste les valeurs client manquantes d’une configuration incomplète", () => {
    const missing = getMissingConfigFields(pendingConfig);

    expect(missing).toEqual(
      expect.arrayContaining([
        "vat.regime",
        "riskMarginRate",
        "rangeSpread",
        "complexityFactors.simple",
        "complexityFactors.complet",
        "urgencyFactors.standard",
        "urgencyFactors.prioritaire",
        "services.web.dailyRate",
        "services.web.baseDays",
        "services.web.features.pages.days",
        "constraints.securite.days",
        "fees.cadrage.amount",
      ]),
    );
    expect(missing).toEqual([...missing].sort());
  });

  it("ne signale aucune valeur manquante sur la configuration de test", () => {
    expect(getMissingConfigFields(fixtureConfig)).toEqual([]);
  });
});

describe("préparation HT sans TVA", () => {
  const htConfig: PricingConfig = {
    ...fixtureConfig,
    vat: { ...fixtureConfig.vat, regime: null, rate: null },
  };

  it("calcule le HT et la fourchette HT, sans TVA ni TTC", () => {
    const result = computeEstimate(htConfig, nominalInput);

    expect(result.status).toBe("ready-ht");
    expect(result.totalHT).toBe(21100);
    expect(result.rangeHT).toEqual({ min: 17950, max: 24250 });
    expect(result.vat.amount).toBeNull();
    expect(result.totalTTC).toBeNull();
    expect(result.rangeTTC).toBeNull();
    expect(result.missingConfig).toEqual(["vat.regime"]);
  });
});

describe("erreurs de saisie", () => {
  it("refuse une option inconnue", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, { ...nominalInput, features: ["pages", "inconnue"] }),
    );

    expect(error.code).toBe("unknown-feature");
  });

  it("refuse une option dupliquée", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, { ...nominalInput, features: ["pages", "pages"] }),
    );

    expect(error.code).toBe("duplicate-feature");
  });

  it("refuse une contrainte inconnue", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, {
        ...nominalInput,
        constraints: ["inconnue" as ConstraintId],
      }),
    );

    expect(error.code).toBe("unknown-constraint");
  });

  it("refuse une contrainte dupliquée", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, {
        ...nominalInput,
        constraints: ["securite", "securite"],
      }),
    );

    expect(error.code).toBe("duplicate-constraint");
  });

  it("refuse un service inconnu", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, { ...nominalInput, service: "mobile" as ServiceId }),
    );

    expect(error.code).toBe("unknown-service");
  });

  it("refuse une complexité inconnue", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, {
        ...nominalInput,
        complexity: "extreme" as ComplexityLevel,
      }),
    );

    expect(error.code).toBe("unknown-complexity");
  });

  it("refuse une urgence inconnue", () => {
    const error = captureInputError(() =>
      computeEstimate(fixtureConfig, { ...nominalInput, urgency: "immediate" as UrgencyLevel }),
    );

    expect(error.code).toBe("unknown-urgency");
  });
});

describe("validatePricingConfig", () => {
  it("accepte la configuration de test", () => {
    expect(validatePricingConfig(fixtureConfig)).toEqual([]);
  });

  it("refuse un pas d’arrondi nul", () => {
    const invalid: PricingConfig = { ...fixtureConfig, roundingStep: 0 };

    expect(validatePricingConfig(invalid)).toContain(
      "roundingStep : nombre strictement positif requis",
    );
  });

  it("refuse un coefficient de complexité nul", () => {
    const invalid: PricingConfig = {
      ...fixtureConfig,
      complexityFactors: { ...fixtureConfig.complexityFactors, standard: 0 },
    };

    expect(validatePricingConfig(invalid)).toContain(
      "complexityFactors.standard : nombre strictement positif ou null requis",
    );
  });

  it("refuse un taux de TVA incohérent avec le régime", () => {
    const franchise: PricingConfig = {
      ...fixtureConfig,
      vat: { ...fixtureConfig.vat, regime: "franchise", rate: 0.2 },
    };
    const standardWithoutRate: PricingConfig = {
      ...fixtureConfig,
      vat: { ...fixtureConfig.vat, rate: null },
    };
    const pendingWithRate: PricingConfig = {
      ...fixtureConfig,
      vat: { ...fixtureConfig.vat, regime: null, rate: 0.2 },
    };

    expect(validatePricingConfig(franchise)).toContain(
      "vat.rate : doit valoir 0 en franchise de TVA",
    );
    expect(validatePricingConfig(standardWithoutRate)).toContain(
      "vat.rate : taux strictement positif requis en régime standard",
    );
    expect(validatePricingConfig(pendingWithRate)).toContain(
      "vat.rate : doit rester null tant que le régime n’est pas choisi",
    );
  });

  it("refuse une option dupliquée dans un service", () => {
    const invalid: PricingConfig = {
      ...fixtureConfig,
      services: {
        ...fixtureConfig.services,
        web: {
          ...fixtureConfig.services.web,
          features: [
            ...fixtureConfig.services.web.features,
            { id: "pages", labelKey: "fixture.duplicate", days: 1 },
          ],
        },
      },
    };

    expect(validatePricingConfig(invalid)).toContain(
      "services.web.features.pages : identifiant dupliqué",
    );
  });

  it("refuse un service manquant", () => {
    const invalid = {
      ...fixtureConfig,
      services: { ...fixtureConfig.services, web: undefined },
    } as unknown as PricingConfig;

    expect(validatePricingConfig(invalid)).toContain("services.web : service manquant");
  });

  it("refuse un forfait rattaché à un service inconnu", () => {
    const invalid = {
      ...fixtureConfig,
      fees: [
        {
          id: "inconnu",
          labelKey: "fixture.fee.inconnu",
          amount: 100,
          appliesTo: ["mobile"],
        },
      ],
    } as unknown as PricingConfig;

    expect(validatePricingConfig(invalid)).toContain(
      "fees.inconnu.appliesTo : service inconnu (mobile)",
    );
  });
});
