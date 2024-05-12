// integration-testing/plans.module.test.ts

import { plansModule } from "../../modules/plans/model";
import { beforeAll, describe, expect, it } from "vitest";


describe("Plans Module", () => {
  describe("findPlanById", () => {
    it("should find a plan by ID", () => {
      const planId = 1;
      const plan = plansModule.findPlanById(planId);
      expect(plan).toBeDefined();
      expect(plan?.id).toBe(planId);
    });

    it("should return undefined for invalid plan ID", () => {
      const planId = 100;
      const plan = plansModule.findPlanById(planId);
      expect(plan).toBeUndefined();
    });
  });

  describe("calculateUpgradePrice", () => {
    it("should calculate prorated upgrade price correctly", () => {
      const currentPlanId = 1;
      const newPlanId = 2;
      const daysRemaining = 15;
      const upgradePrice = plansModule.calculateUpgradePrice(
        currentPlanId,
        newPlanId,
        daysRemaining
      );
      // Assuming daily price difference is $0.33 (for testing)
      expect(upgradePrice).toBe(4.95); // 15 days * $0.33 = $4.95
    });

    it("should throw error for invalid plan ID", () => {
      const currentPlanId = 1;
      const newPlanId = 100;
      const daysRemaining = 15;
      expect(() =>
        plansModule.calculateUpgradePrice(currentPlanId, newPlanId, daysRemaining)
      ).toThrowError("Invalid plan ID");
    });
  });
});
