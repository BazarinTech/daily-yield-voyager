
export type PackageTier = 'Starter' | 'Growth' | 'Premium' | 'Elite';

export interface Package {
  id: string;
  name: string;
  tier: PackageTier;
  minInvestment: number;
  maxInvestment: number;
  dailyReturnRange: {
    min: number;
    max: number;
  };
  durationDays: number;
  description: string;
  riskLevel: number; // 1-5, with 1 being lowest risk
}

export interface Investment {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  totalReturn: number;
  dailyReturns: DailyReturn[];
}

export interface DailyReturn {
  date: string;
  amount: number;
  percentage: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  totalInvested: number;
  totalReturns: number;
}

export interface Stats {
  totalInvested: number;
  activeInvestments: number;
  totalEarned: number;
  averageReturn: number;
}
