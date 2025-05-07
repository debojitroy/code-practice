import type { Plan, Tier } from './types/plan';
import type { Usage } from './types/usage';

export enum BillingPreference {
  Monthly,
  Annual,
}

export type BillEstimate = {
  totalCost: number;
  monthlyCost: {
    month: number;
    cost: number;
    plan: Plan;
  }[];
};

export const calculateCost = (
  fromMonth: number,
  toMonth: number,
  usage: Usage[],
  billingPreference: BillingPreference
): BillEstimate => {
  const billEstimate: BillEstimate = {
    totalCost: 0,
    monthlyCost: [],
  };

  // Filter the months in scope
  const filteredUsage = usage.filter(
    (x) => x.month >= fromMonth && x.month <= toMonth
  );

  filteredUsage.forEach((usage) => {
    const monthlyUsage = getMonthlyEstimate(usage, billingPreference);

    billEstimate.totalCost += monthlyUsage;
    billEstimate.monthlyCost.push({
      month: usage.month,
      cost: monthlyUsage,
      plan: usage.plan,
    });
  });

  return billEstimate;
};

const getMonthlyEstimate = (
  usage: Usage,
  billingPreference: BillingPreference
): number => {
  if (usage.plan.tiers && usage.plan.tiers.length > 0) {
    let monthlyUsage = 0;
    const tieredPrices = getTieredPricing(
      usage.seats,
      usage.plan.tiers,
      billingPreference
    );
    tieredPrices.map((x) => (monthlyUsage += x.seatCount * x.perUserPrice));

    return monthlyUsage;
  } else {
    return usage.seats * getPerUserPrice(usage.plan, billingPreference);
  }
};

const getPerUserPrice = (plan: Plan, billingPreference: BillingPreference) => {
  if (billingPreference === BillingPreference.Annual) {
    return plan.annualPrice;
  } else {
    return plan.monthlyPrice;
  }
};

const getTieredPricing = (
  seats: number,
  tiers: Tier[],
  billingPreference: BillingPreference
): { seatCount: number; perUserPrice: number }[] => {
  const tieredPricing: { seatCount: number; perUserPrice: number }[] = [];

  let residualSeats = seats;

  tiers.forEach((tier) => {
    // No seats are left
    if (residualSeats === 0) return;

    if (tier.to === -1) {
      // final tier
      tieredPricing.push({
        seatCount: residualSeats,
        perUserPrice:
          billingPreference === BillingPreference.Annual
            ? tier.annualPrice
            : tier.monthlyPrice,
      });
      return;
    }

    const tierSeatCount = tier.to - tier.from + 1; // For inclusive to

    const tierSeats =
      residualSeats > tierSeatCount ? tierSeatCount : residualSeats;
    residualSeats = Math.max(0, residualSeats - tierSeatCount);

    tieredPricing.push({
      seatCount: tierSeats,
      perUserPrice:
        billingPreference === BillingPreference.Annual
          ? tier.annualPrice
          : tier.monthlyPrice,
    });
  });

  return tieredPricing;
};
