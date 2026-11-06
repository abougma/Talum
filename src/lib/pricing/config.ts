import type { PricingConfig, PricingFeature, PricingService, ServiceId } from "./types";

/**
 * Configuration publique de l’estimateur.
 *
 * RÈGLE : les valeurs métier appartiennent au client. Tant qu’elles ne sont
 * pas fournies, elles restent `null` ; le moteur renvoie alors
 * `status: "pending-config"` et l’interface n’affiche aucun prix.
 *
 * Pour activer l’estimateur, remplacer chaque `null` par la valeur validée par
 * le client, puis renseigner `vat.regime` (`"franchise"` ou `"standard"`).
 * Voir README.md, section « Modifier les tarifs ».
 */
function pendingFeature(id: string, labelKey: string): PricingFeature {
  return { id, labelKey, days: null };
}

function pendingService(labelKey: string, features: PricingFeature[]): PricingService {
  return {
    labelKey,
    dailyRate: null, // [À COMPLÉTER] TJM HT validé par le client
    baseDays: null, // [À COMPLÉTER] charge de base validée par le client
    features,
  };
}

export const pricingConfig: PricingConfig = {
  version: "2026-11-06-draft",
  currency: "EUR",
  vat: {
    regime: null, // [À COMPLÉTER] franchise (293 B) ou standard
    rate: null, // [À COMPLÉTER] 0 en franchise, 0.2 en standard
    franchiseMentionKey: "EstimatePricing.vatFranchise",
  },
  riskMarginRate: null, // [À COMPLÉTER] marge de risque (fraction)
  rangeSpread: null, // [À COMPLÉTER] amplitude de la fourchette (fraction)
  // Paramètres de forme, sans impact commercial :
  roundingStep: 50,
  dayRounding: 0.5,
  workingDaysPerWeek: 5,
  complexityFactors: {
    simple: null, // [À COMPLÉTER]
    standard: null, // [À COMPLÉTER]
    avance: null, // [À COMPLÉTER]
    complet: null, // [À COMPLÉTER]
  },
  urgencyFactors: {
    standard: null, // [À COMPLÉTER]
    confort: null, // [À COMPLÉTER]
    prioritaire: null, // [À COMPLÉTER]
  },
  services: {
    web: pendingService("EstimatePricing.services.web", [
      pendingFeature("pages", "EstimatePricing.features.web.pages"),
      pendingFeature("authentification", "EstimatePricing.features.web.authentification"),
      pendingFeature("paiement", "EstimatePricing.features.web.paiement"),
      pendingFeature("back-office", "EstimatePricing.features.web.backOffice"),
      pendingFeature("integrations", "EstimatePricing.features.web.integrations"),
      pendingFeature("multilingue", "EstimatePricing.features.web.multilingue"),
    ]),
    api: pendingService("EstimatePricing.services.api", [
      pendingFeature("authentification", "EstimatePricing.features.api.authentification"),
      pendingFeature("integrations", "EstimatePricing.features.api.integrations"),
      pendingFeature("temps-reel", "EstimatePricing.features.api.tempsReel"),
      pendingFeature("notifications", "EstimatePricing.features.api.notifications"),
      pendingFeature("documentation", "EstimatePricing.features.api.documentation"),
    ]),
    "cloud-devops": pendingService("EstimatePricing.services.cloudDevops", [
      pendingFeature("conteneurisation", "EstimatePricing.features.cloud.conteneurisation"),
      pendingFeature("ci-cd", "EstimatePricing.features.cloud.ciCd"),
      pendingFeature("supervision", "EstimatePricing.features.cloud.supervision"),
      pendingFeature("sauvegardes", "EstimatePricing.features.cloud.sauvegardes"),
      pendingFeature("secrets", "EstimatePricing.features.cloud.secrets"),
    ]),
    "gestion-de-projet": pendingService("EstimatePricing.services.gestionDeProjet", [
      pendingFeature("accompagnement-hebdomadaire", "EstimatePricing.features.pm.accompagnement"),
      pendingFeature("recette", "EstimatePricing.features.pm.recette"),
      pendingFeature("formation", "EstimatePricing.features.pm.formation"),
      pendingFeature("reporting", "EstimatePricing.features.pm.reporting"),
      pendingFeature("coordination-partenaires", "EstimatePricing.features.pm.coordination"),
    ]),
    ia: pendingService("EstimatePricing.services.ia", [
      pendingFeature("chatbot", "EstimatePricing.features.ia.chatbot"),
      pendingFeature("rag", "EstimatePricing.features.ia.rag"),
      pendingFeature("agents", "EstimatePricing.features.ia.agents"),
      pendingFeature("automatisation", "EstimatePricing.features.ia.automatisation"),
      pendingFeature("evaluation-qualite", "EstimatePricing.features.ia.evaluation"),
    ]),
    conseil: pendingService("EstimatePricing.services.conseil", [
      pendingFeature("audit-architecture", "EstimatePricing.features.conseil.auditArchitecture"),
      pendingFeature("audit-code", "EstimatePricing.features.conseil.auditCode"),
      pendingFeature("audit-securite", "EstimatePricing.features.conseil.auditSecurite"),
      pendingFeature("atelier-restitution", "EstimatePricing.features.conseil.atelier"),
      pendingFeature("plan-action", "EstimatePricing.features.conseil.planAction"),
    ]),
  },
  constraints: [
    {
      id: "securite",
      labelKey: "EstimatePricing.constraints.securite",
      days: null, // [À COMPLÉTER]
    },
    {
      id: "conformite",
      labelKey: "EstimatePricing.constraints.conformite",
      days: null, // [À COMPLÉTER]
    },
    {
      id: "integration-existant",
      labelKey: "EstimatePricing.constraints.integration",
      days: null, // [À COMPLÉTER]
    },
    {
      id: "hebergement",
      labelKey: "EstimatePricing.constraints.hebergement",
      days: null, // [À COMPLÉTER]
    },
    {
      id: "maintenance",
      labelKey: "EstimatePricing.constraints.maintenance",
      days: null, // [À COMPLÉTER]
    },
  ],
  fees: [
    {
      id: "cadrage",
      labelKey: "EstimatePricing.fees.cadrage",
      amount: null, // [À COMPLÉTER]
      appliesTo: "all",
    },
    {
      id: "mise-en-production",
      labelKey: "EstimatePricing.fees.miseEnProduction",
      amount: null, // [À COMPLÉTER]
      appliesTo: "all",
    },
  ],
  exclusions: [
    "EstimatePricing.exclusions.contenus",
    "EstimatePricing.exclusions.licences",
    "EstimatePricing.exclusions.deplacements",
    "EstimatePricing.exclusions.fraisLegaux",
    "EstimatePricing.exclusions.supportUrgence",
  ],
};

/** Services réellement proposés, dans l’ordre d’affichage de l’estimateur. */
export const pricingServiceOrder: ServiceId[] = [
  "web",
  "api",
  "cloud-devops",
  "gestion-de-projet",
  "ia",
  "conseil",
];
