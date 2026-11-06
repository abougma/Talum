import { describe, expect, it } from "vitest";
import { pricingConfig, pricingServiceOrder } from "../config";
import { computeEstimate, getMissingConfigFields, validatePricingConfig } from "../engine";
import { SERVICE_IDS } from "../types";

describe("configuration publique", () => {
  it("est structurellement valide malgré les valeurs en attente", () => {
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

  it("reste en attente pour chaque service tant que les TJM manquent", () => {
    for (const service of SERVICE_IDS) {
      const estimate = computeEstimate(pricingConfig, {
        service,
        features: [],
        constraints: [],
        complexity: "standard",
        urgency: "standard",
      });

      expect(estimate.status, service).toBe("pending-config");
      expect(estimate.totalHT, service).toBeNull();
    }
  });

  it("expose une liste de valeurs manquantes non vide", () => {
    expect(getMissingConfigFields(pricingConfig).length).toBeGreaterThan(0);
  });
});
