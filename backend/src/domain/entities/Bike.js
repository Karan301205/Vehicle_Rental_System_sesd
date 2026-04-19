import { Vehicle } from "./Vehicle.js";

export class Bike extends Vehicle {
  calculateRentalCost(hours) {
    const baseAmount = this.getHourlyBaseAmount(hours);
    const engineCapacity = Number(this.specificAttributes.engineCapacity ?? 0);
    const premiumEngineSurcharge = engineCapacity >= 300 ? hours * 0.65 : 0;
    const helmetKitFee = this.specificAttributes.helmetType ? 2.5 : 0;

    return Number((baseAmount + premiumEngineSurcharge + helmetKitFee).toFixed(2));
  }
}

