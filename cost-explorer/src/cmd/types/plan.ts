export type Tier = {
  from: number;
  to: number;
  monthlyPrice: number;
  annualPrice: number;
};

export type Plan = {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  tiers?: Tier[];
};
