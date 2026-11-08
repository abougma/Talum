import type { PricingConfig, ServiceId } from "./types";

/**
 * Grille tarifaire publique — `[PROPOSITION]` 2026-11-08.
 *
 * Les montants ci-dessous sont une proposition commerciale construite à partir
 * des ordres de grandeur du marché français 2026 (voir docs/pricing-proposal.md).
 * Ils ne sont PAS validés par le client. Toute modification doit être reportée
 * dans ce fichier puis vérifiée par `npm test`.
 *
 * RÈGLE TVA : `vat.regime` et `vat.rate` restent `null` tant que la société
 * n’est pas créée et que le régime applicable n’est pas validé. Le moteur
 * renvoie alors `status: "ready-ht"` : les montants HT sont publiables, la TVA,
 * le TTC et le PDF restent indisponibles.
 *
 * RÈGLE PRIX : aucun composant ne contient de prix en dur. Tout passe par cette
 * configuration typée.
 */
export const pricingConfig: PricingConfig = {
  version: "2026-11-08-proposition",
  currency: "EUR",
  vat: {
    regime: null, // [À COMPLÉTER] franchise (293 B) ou standard — société non créée
    rate: null, // [À COMPLÉTER] 0 en franchise, 0.2 en standard
    franchiseMentionKey: "EstimatePricing.vatFranchise",
  },
  /** Marge de risque : 10 %, dans la fourchette usuelle des prestations au forfait. */
  riskMarginRate: 0.1,
  /** Amplitude de la fourchette : ±15 %. */
  rangeSpread: 0.15,
  // Paramètres de forme, sans impact commercial :
  roundingStep: 50,
  dayRounding: 0.5,
  workingDaysPerWeek: 5,
  complexityFactors: {
    simple: 0.75,
    standard: 1,
    avance: 1.3,
    complet: 1.6,
  },
  urgencyFactors: {
    standard: 1,
    confort: 1.1,
    prioritaire: 1.25,
  },
  services: {
    /**
     * TJM senior positionné dans le haut de la fourchette « confirmé »
     * (450–650 €/j), pour un développement direct sans couche agence.
     */
    web: {
      labelKey: "EstimatePricing.services.web",
      dailyRate: 550,
      baseDays: 8,
      features: [
        { id: "pages", labelKey: "EstimatePricing.features.web.pages", days: 3 },
        {
          id: "authentification",
          labelKey: "EstimatePricing.features.web.authentification",
          days: 3,
        },
        { id: "paiement", labelKey: "EstimatePricing.features.web.paiement", days: 4 },
        {
          id: "back-office",
          labelKey: "EstimatePricing.features.web.backOffice",
          days: 5,
        },
        { id: "integrations", labelKey: "EstimatePricing.features.web.integrations", days: 4 },
        { id: "multilingue", labelKey: "EstimatePricing.features.web.multilingue", days: 2 },
      ],
    },
    /** API et intégrations : TJM au-dessus du web, proche du haut de marché confirmé. */
    api: {
      labelKey: "EstimatePricing.services.api",
      dailyRate: 600,
      baseDays: 6,
      features: [
        {
          id: "authentification",
          labelKey: "EstimatePricing.features.api.authentification",
          days: 2,
        },
        { id: "integrations", labelKey: "EstimatePricing.features.api.integrations", days: 4 },
        { id: "temps-reel", labelKey: "EstimatePricing.features.api.tempsReel", days: 3 },
        { id: "notifications", labelKey: "EstimatePricing.features.api.notifications", days: 2 },
        { id: "documentation", labelKey: "EstimatePricing.features.api.documentation", days: 1 },
      ],
    },
    /** Cloud & DevOps : compétence rare, TJM haut de la fourchette confirmée. */
    "cloud-devops": {
      labelKey: "EstimatePricing.services.cloudDevops",
      dailyRate: 650,
      baseDays: 4,
      features: [
        {
          id: "conteneurisation",
          labelKey: "EstimatePricing.features.cloud.conteneurisation",
          days: 3,
        },
        { id: "ci-cd", labelKey: "EstimatePricing.features.cloud.ciCd", days: 3 },
        { id: "supervision", labelKey: "EstimatePricing.features.cloud.supervision", days: 2 },
        { id: "sauvegardes", labelKey: "EstimatePricing.features.cloud.sauvegardes", days: 2 },
        { id: "secrets", labelKey: "EstimatePricing.features.cloud.secrets", days: 1 },
      ],
    },
    /** Gestion de projet technique : bas de la fourchette 600–900 €/j du marché. */
    "gestion-de-projet": {
      labelKey: "EstimatePricing.services.gestionDeProjet",
      dailyRate: 600,
      baseDays: 4,
      features: [
        {
          id: "accompagnement-hebdomadaire",
          labelKey: "EstimatePricing.features.pm.accompagnement",
          days: 1,
        },
        { id: "recette", labelKey: "EstimatePricing.features.pm.recette", days: 2 },
        { id: "formation", labelKey: "EstimatePricing.features.pm.formation", days: 2 },
        { id: "reporting", labelKey: "EstimatePricing.features.pm.reporting", days: 1 },
        {
          id: "coordination-partenaires",
          labelKey: "EstimatePricing.features.pm.coordination",
          days: 2,
        },
      ],
    },
    /**
     * IA : ligne de service distincte, pas une option du web. TJM 850 €/j,
     * entre les consultants IA/audit (600–900 €/j) et les experts en IA
     * générative (> 950 €/j). L’audit express doit rester dans la fourchette
     * marché de 2 000–4 000 € HT ; l’audit complet dans 6 000–12 000 € HT.
     */
    ia: {
      labelKey: "EstimatePricing.services.ia",
      dailyRate: 850,
      baseDays: 3,
      features: [
        { id: "audit-ia", labelKey: "EstimatePricing.features.ia.audit", days: 4 },
        { id: "chatbot", labelKey: "EstimatePricing.features.ia.chatbot", days: 3 },
        { id: "rag", labelKey: "EstimatePricing.features.ia.rag", days: 5 },
        { id: "agents", labelKey: "EstimatePricing.features.ia.agents", days: 7 },
        { id: "automatisation", labelKey: "EstimatePricing.features.ia.automatisation", days: 4 },
        { id: "evaluation-qualite", labelKey: "EstimatePricing.features.ia.evaluation", days: 3 },
        { id: "formation", labelKey: "EstimatePricing.features.ia.formation", days: 2 },
      ],
    },
    /** Conseil et audit technique : marché indépendant 600–900 €/j. */
    conseil: {
      labelKey: "EstimatePricing.services.conseil",
      dailyRate: 750,
      baseDays: 3,
      features: [
        {
          id: "audit-architecture",
          labelKey: "EstimatePricing.features.conseil.auditArchitecture",
          days: 2,
        },
        { id: "audit-code", labelKey: "EstimatePricing.features.conseil.auditCode", days: 3 },
        {
          id: "audit-securite",
          labelKey: "EstimatePricing.features.conseil.auditSecurite",
          days: 2,
        },
        { id: "atelier-restitution", labelKey: "EstimatePricing.features.conseil.atelier", days: 1 },
        { id: "plan-action", labelKey: "EstimatePricing.features.conseil.planAction", days: 1 },
      ],
    },
  },
  constraints: [
    {
      id: "securite",
      labelKey: "EstimatePricing.constraints.securite",
      days: 3,
    },
    {
      id: "conformite",
      labelKey: "EstimatePricing.constraints.conformite",
      days: 3,
    },
    {
      /** Cadrage AI Act, classification, supervision humaine, documentation. */
      id: "conformite-ia",
      labelKey: "EstimatePricing.constraints.conformiteIa",
      days: 4,
    },
    {
      id: "integration-existant",
      labelKey: "EstimatePricing.constraints.integration",
      days: 4,
    },
    {
      id: "hebergement",
      labelKey: "EstimatePricing.constraints.hebergement",
      days: 2,
    },
    {
      id: "maintenance",
      labelKey: "EstimatePricing.constraints.maintenance",
      days: 1,
    },
  ],
  fees: [
    {
      id: "cadrage",
      labelKey: "EstimatePricing.fees.cadrage",
      amount: 900,
      // Le conseil inclut déjà son propre cadrage : pas de double facturation.
      appliesTo: ["web", "api", "cloud-devops", "gestion-de-projet", "ia"],
    },
    {
      id: "mise-en-production",
      labelKey: "EstimatePricing.fees.miseEnProduction",
      amount: 600,
      // L’IA est facturée au périmètre (audit, prototype, mise en service) :
      // pas de frais de mise en production appliqués aveuglément.
      appliesTo: ["web", "api", "cloud-devops"],
    },
  ],
  exclusions: [
    "EstimatePricing.exclusions.contenus",
    "EstimatePricing.exclusions.licences",
    "EstimatePricing.exclusions.deplacements",
    "EstimatePricing.exclusions.fraisLegaux",
    "EstimatePricing.exclusions.supportUrgence",
    "EstimatePricing.exclusions.coutModeles",
    "EstimatePricing.exclusions.infrastructure",
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
