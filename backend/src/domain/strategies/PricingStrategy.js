import { AppError } from "../../utils/app-error.js";

export class PricingStrategy {
  calculatePrice(_baseAmount, _context = {}) {
    throw new AppError("PricingStrategy subclasses must implement calculatePrice", 500);
  }
}

