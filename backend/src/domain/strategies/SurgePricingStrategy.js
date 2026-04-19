import { PricingStrategy } from "./PricingStrategy.js";

export class SurgePricingStrategy extends PricingStrategy {
  constructor(multiplier = 1.2) {
    super();
    this.multiplier = multiplier;
  }

  calculatePrice(baseAmount, context = {}) {
    const effectiveMultiplier = Number(context.multiplier ?? this.multiplier);
    return Number((Number(baseAmount) * effectiveMultiplier).toFixed(2));
  }
}

