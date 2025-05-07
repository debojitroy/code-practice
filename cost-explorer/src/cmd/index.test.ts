import { describe, expect, test } from 'bun:test';
import { calculateCost, BillingPreference } from './index';
import type { Usage } from './types/usage';
import type { Plan } from './types/plan';

// Define some plans
export const standardPlan: Plan = {
  name: 'Standard',
  monthlyPrice: 15,
  annualPrice: 10,
};

export const premiumPlan: Plan = {
  name: 'Premium',
  monthlyPrice: 20,
  annualPrice: 15,
};

export const standardTieredPlan: Plan = {
  name: 'Standard',
  monthlyPrice: 15,
  annualPrice: 10,
  tiers: [
    {
      from: 1,
      to: 100,
      monthlyPrice: 15,
      annualPrice: 10,
    },
    {
      from: 101,
      to: -1,
      monthlyPrice: 10,
      annualPrice: 8,
    },
  ],
};

export const premiumTieredPlan: Plan = {
  name: 'Premium',
  monthlyPrice: 20,
  annualPrice: 15,
  tiers: [
    {
      from: 1,
      to: 100,
      monthlyPrice: 20,
      annualPrice: 15,
    },
    {
      from: 101,
      to: -1,
      monthlyPrice: 15,
      annualPrice: 10,
    },
  ],
};

describe('Cost Explorer', () => {
  test('should aggregate cost across single plan for monthly billing', () => {
    const usage: Usage[] = [
      {
        month: 202501,
        plan: standardPlan,
        seats: 100,
      },
      {
        month: 202502,
        plan: standardPlan,
        seats: 200,
      },
    ];

    // Expected usage => totalCost: 100*15 + 200*15
    expect(
      calculateCost(202501, 202502, usage, BillingPreference.Monthly)
    ).toEqual({
      totalCost:
        100 * standardPlan.monthlyPrice + 200 * standardPlan.monthlyPrice,
      monthlyCost: [
        {
          month: 202501,
          plan: standardPlan,
          cost: 100 * standardPlan.monthlyPrice,
        },
        {
          month: 202502,
          plan: standardPlan,
          cost: 200 * standardPlan.monthlyPrice,
        },
      ],
    });
  });

  test('should aggregate cost across single plan for annual billing', () => {
    const usage: Usage[] = [
      {
        month: 202501,
        plan: standardPlan,
        seats: 100,
      },
      {
        month: 202502,
        plan: standardPlan,
        seats: 200,
      },
    ];

    // Expected usage => totalCost: 100*15 + 200*15
    expect(
      calculateCost(202501, 202502, usage, BillingPreference.Annual)
    ).toEqual({
      totalCost:
        100 * standardPlan.annualPrice + 200 * standardPlan.annualPrice,
      monthlyCost: [
        {
          month: 202501,
          plan: standardPlan,
          cost: 100 * standardPlan.annualPrice,
        },
        {
          month: 202502,
          plan: standardPlan,
          cost: 200 * standardPlan.annualPrice,
        },
      ],
    });
  });

  test('should respect input from and to months', () => {
    const usage: Usage[] = [
      {
        month: 202412,
        plan: standardPlan,
        seats: 200,
      },
      {
        month: 202501,
        plan: standardPlan,
        seats: 100,
      },
      {
        month: 202502,
        plan: standardPlan,
        seats: 200,
      },
      {
        month: 202503,
        plan: standardPlan,
        seats: 100,
      },
    ];

    expect(
      calculateCost(202501, 202503, usage, BillingPreference.Annual)
    ).toEqual({
      totalCost:
        100 * standardPlan.annualPrice +
        200 * standardPlan.annualPrice +
        100 * standardPlan.annualPrice,
      monthlyCost: [
        {
          month: 202501,
          plan: standardPlan,
          cost: 100 * standardPlan.annualPrice,
        },
        {
          month: 202502,
          plan: standardPlan,
          cost: 200 * standardPlan.annualPrice,
        },
        {
          month: 202503,
          plan: standardPlan,
          cost: 100 * standardPlan.annualPrice,
        },
      ],
    });
  });

  test('should be able to handle mixed plans in usage', () => {
    const usage: Usage[] = [
      {
        month: 202412,
        plan: standardPlan,
        seats: 200,
      },
      {
        month: 202501,
        plan: standardPlan,
        seats: 100,
      },
      {
        month: 202502,
        plan: premiumPlan,
        seats: 200,
      },
      {
        month: 202503,
        plan: premiumPlan,
        seats: 100,
      },
    ];

    expect(
      calculateCost(202412, 202503, usage, BillingPreference.Annual)
    ).toEqual({
      totalCost:
        200 * standardPlan.annualPrice +
        100 * standardPlan.annualPrice +
        200 * premiumPlan.annualPrice +
        100 * premiumPlan.annualPrice,
      monthlyCost: [
        {
          month: 202412,
          plan: standardPlan,
          cost: 200 * standardPlan.annualPrice,
        },
        {
          month: 202501,
          plan: standardPlan,
          cost: 100 * standardPlan.annualPrice,
        },
        {
          month: 202502,
          plan: premiumPlan,
          cost: 200 * premiumPlan.annualPrice,
        },
        {
          month: 202503,
          plan: premiumPlan,
          cost: 100 * premiumPlan.annualPrice,
        },
      ],
    });
  });

  test('should prefer tiered plans when available', () => {
    const usage: Usage[] = [
      {
        month: 202501,
        plan: standardTieredPlan,
        seats: 500,
      },
      {
        month: 202502,
        plan: premiumTieredPlan,
        seats: 300,
      },
    ];

    expect(
      calculateCost(202501, 202502, usage, BillingPreference.Annual)
    ).toEqual({
      totalCost: 100 * 10 + 400 * 8 + 100 * 15 + 200 * 10,
      monthlyCost: [
        {
          month: 202501,
          plan: standardTieredPlan,
          cost: 100 * 10 + 400 * 8,
        },
        {
          month: 202502,
          plan: premiumTieredPlan,
          cost: 100 * 15 + 200 * 10,
        },
      ],
    });
  });
});
