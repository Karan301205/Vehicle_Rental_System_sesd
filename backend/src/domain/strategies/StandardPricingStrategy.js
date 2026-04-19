import { PricingStrategy } from "./PricingStrategy.js";

export class StandardPricingStrategy extends PricingStrategy {
  calculatePrice(baseAmount) {
    return Number(Number(baseAmount).toFixed(2));
  }
}

