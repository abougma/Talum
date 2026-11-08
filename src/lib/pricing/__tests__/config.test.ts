import { describe, expect, it } from "vitest";
import { pricingConfig, pricingServiceOrder } from "../config";
import { computeEstimate, getMissingConfigFields, validatePricingConfig } from "../engine";
import { SERVICE_IDS } from "../types";

describe("configuration publique", () => {
  it("est structurellement valide malgré la TVA en attente", () => {
    expect(validatePricingConfig(pricingConfig)).toEqual([]);
  });

  it("déclare les six services dans l’ordre d’affichage", () => {
    expect(pricingServiceOrder).toEqual([
      "web",
      "api",
      "cloud-devops",
      "gestion-de-projet",
      "ia",
      "conseil",
    ]);
    expect(new Set(pricingServiceOrder).size).toBe(pricingServiceOrder.length);
    expect([...pricingServiceOrder].sort()).toEqual([...SERVICE_IDS].sort());
  });

  it("utilise des clés i18n pour tous les libellés", () => {
    for (const service of Object.values(pricingConfig.services)) {
      expect(service.labelKey.startsWith("EstimatePricing.")).toBe(true);

      for (const feature of service.features) {
        expect(feature.labelKey.startsWith("EstimatePricing.")).toBe(true);
      }
    }

    for (const constraint of pricingConfig.constraints) {
      expect(constraint.labelKey.startsWith("EstimatePricing.")).toBe(true);
    }

    for (const fee of pricingConfig.fees) {
      expect(fee.labelKey.startsWith("EstimatePricing.")).toBe(true);
    }

    expect(pricingConfig.vat.franchiseMentionKey.startsWith("EstimatePricing.")).toBe(true);

    for (const exclusion of pricingConfig.exclusions) {
      expect(exclusion.startsWith("EstimatePricing.")).toBe(true);
    }
  });

  it("n’a aucun identifiant d’option dupliqué dans un service", () => {
    for (const service of Object.values(pricingConfig.services)) {
      const ids = service.features.map((feature) => feature.id);

      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("publie une estimation HT pour chaque service, sans TVA ni TTC", () => {
    for (const service of SERVICE_IDS) {
      const estimate = computeEstimate(pricingConfig, {
        service,
        features: [],
        constraints: [],
        complexity: "standard",
        urgency: "standard",
      });

      expect(estimate.status, service).toBe("ready-ht");
      expect(estimate.totalHT, service).not.toBeNull();
      expect(estimate.totalHT, service).toBeGreaterThan(0);
      expect(estimate.rangeHT, service).not.toBeNull();
      expect(estimate.durationWeeks, service).not.toBeNull();
      expect(estimate.vat.regime, service).toBeNull();
      expect(estimate.vat.amount, service).toBeNull();
      expect(estimate.totalTTC, service).toBeNull();
      expect(estimate.rangeTTC, service).toBeNull();
      expect(estimate.missingConfig, service).toEqual(["vat.regime"]);
    }
  });

  it("ne laisse manquer que le régime de TVA", () => {
    expect(getMissingConfigFields(pricingConfig)).toEqual(["vat.regime"]);
  });

  it("positionne l’IA comme ligne de service à forte valeur", () => {
    const iaRate = pricingConfig.services.ia.dailyRate ?? 0;
    const webRate = pricingConfig.services.web.dailyRate ?? 0;
    const conseilRate = pricingConfig.services.conseil.dailyRate ?? 0;
    const pmRate = pricingConfig.services["gestion-de-projet"].dailyRate ?? 0;

    expect(iaRate).toBeGreaterThan(conseilRate);
    expect(conseilRate).toBeGreaterThan(webRate);
    expect(pmRate).toBeGreaterThanOrEqual(webRate);
  });

  it("garde la TVA et les données légales hors de la grille publiée", () => {
    expect(pricingConfig.vat.regime).toBeNull();
    expect(pricingConfig.vat.rate).toBeNull();
  });

  it("prévoit une contrainte de conformité IA", () => {
    const constraint = pricingConfig.constraints.find((item) => item.id === "conformite-ia");

    expect(constraint).toBeDefined();
    expect(constraint?.days).toBeGreaterThan(0);
  });
});
