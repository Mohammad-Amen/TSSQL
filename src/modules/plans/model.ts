// Define types for plans
type Plan = {
    id: number;
    name: string;
    price: number;
  };
  
  // Placeholder data for plans
  const plans: Plan[] = [
    { id: 1, name: "Basic", price: 10 },
    { id: 2, name: "Premium", price: 20 },
    { id: 3, name: "Enterprise", price: 30 },
  ];
  
  // Method to find a plan by ID
  const findPlanById = (planId: number): Plan | undefined => {
    return plans.find((plan) => plan.id === planId);
  };
  
  // Method to calculate prorated upgrade price
  const calculateUpgradePrice = (
    currentPlanId: number,
    newPlanId: number,
    daysRemaining: number
  ): number => {
    const currentPlan = findPlanById(currentPlanId);
    const newPlan = findPlanById(newPlanId);
    if (!currentPlan || !newPlan) {
      throw new Error("Invalid plan ID");
    }
  
    const priceDifference = newPlan.price - currentPlan.price;
    const dailyPriceDifference = priceDifference / 30; // Assuming monthly cycles
    return Math.round((dailyPriceDifference * daysRemaining) * 100) / 100;
  };
  
  // Exporting methods
  export const plansModule = {
    findPlanById,
    calculateUpgradePrice,
  };
  