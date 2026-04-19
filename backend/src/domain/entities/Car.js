import { Vehicle } from "./Vehicle.js";

export class Car extends Vehicle {
  calculateRentalCost(hours) {
    const baseAmount = this.getHourlyBaseAmount(hours);
    const hasAC = Boolean(this.specificAttributes.hasAC);
    const doors = Number(this.specificAttributes.doors ?? 4);
    const comfortPremium = hasAC ? hours * 1.25 : 0;
    const sizePremium = doors > 4 ? hours * 0.75 : 0;

    return Number((baseAmount + comfortPremium + sizePremium).toFixed(2));
  }
}

