import type { PricingConfig, PricingFeature, PricingService } from "../types";

/**
 * Configuration de test uniquement. Les valeurs sont arbitraires et ne doivent
 * jamais être publiées : elles servent à prouver le comportement du moteur.
 */
function feature(id: string, days: number): PricingFeature {
  return { id, labelKey: `fixture.feature.${id}`, days };
}

function service(
  labelKey: string,
  dailyRate: number,
  baseDays: number,
  features: Record<string, number>,
): PricingService {
  return {
    labelKey,
    dailyRate,
    baseDays,
    features: Object.entries(features).map(([id, days]) => feature(id, days)),
  };
}

export const fixtureConfig: PricingConfig = {
  version: "fixture-1",
  currency: "EUR",
  vat: {
    regime: "standard",
    rate: 0.2,
    franchiseMentionKey: "fixture.vat.franchise",
  },
  riskMarginRate: 0.1,
  rangeSpread: 0.15,
  roundingStep: 50,
  dayRounding: 0.5,
  workingDaysPerWeek: 5,
  complexityFactors: {
    simple: 0.8,
    standard: 1,
    avance: 1.25,
    complet: 1.6,
  },
  urgencyFactors: {
    standard: 1,
    confort: 1.1,
    prioritaire: 1.4,
  },
  services: {
    web: service("fixture.service.web", 600, 10, {
      pages: 3,
      authentification: 4,
      paiement: 5,
      "back-office": 4,
    }),
    api: service("fixture.service.api", 650, 8, {
      authentification: 3,
      "temps-reel": 4,
      notifications: 2,
    }),
    "cloud-devops": service("fixture.service.cloud", 700, 6, {
      conteneurisation: 4,
      "ci-cd": 5,
      supervision: 3,
    }),
    "gestion-de-projet": service("fixture.service.pm", 550, 5, {
      "accompagnement-hebdomadaire": 4,
      recette: 3,
    }),
    ia: service("fixture.service.ia", 750, 9, {
      chatbot: 5,
      rag: 7,
      agents: 8,
    }),
    conseil: service("fixture.service.conseil", 700, 4, {
      "audit-code": 5,
      "audit-architecture": 6,
    }),
  },
  constraints: [
    { id: "securite", labelKey: "fixture.constraint.securite", days: 3 },
    { id: "conformite", labelKey: "fixture.constraint.conformite", days: 2 },
    { id: "integration-existant", labelKey: "fixture.constraint.integration", days: 5 },
    { id: "hebergement", labelKey: "fixture.constraint.hebergement", days: 2 },
    { id: "maintenance", labelKey: "fixture.constraint.maintenance", days: 2 },
  ],
  fees: [
    { id: "cadrage", labelKey: "fixture.fee.cadrage", amount: 1500, appliesTo: "all" },
    {
      id: "mise-en-production",
      labelKey: "fixture.fee.mise-en-production",
      amount: 1200,
      appliesTo: "all",
    },
  ],
  exclusions: [
    "fixture.exclusion.contenus",
    "fixture.exclusion.licences",
    "fixture.exclusion.deplacements",
  ],
};
