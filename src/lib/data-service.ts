
import { v4 as uuidv4 } from 'uuid';
import { User, Package, Investment, DailyReturn, Stats } from '@/types';

// Mock packages data
export const packages: Package[] = [
  {
    id: '1',
    name: 'Forex Starter',
    tier: 'Starter',
    minInvestment: 100,
    maxInvestment: 1000,
    dailyReturnRange: {
      min: 1,
      max: 2
    },
    durationDays: 30,
    description: 'Low risk investment package for beginners with stable daily returns.',
    riskLevel: 1
  },
  {
    id: '2',
    name: 'Growth Trader',
    tier: 'Growth',
    minInvestment: 1000,
    maxInvestment: 5000,
    dailyReturnRange: {
      min: 1.5,
      max: 3
    },
    durationDays: 60,
    description: 'Balanced risk-reward package for intermediate investors seeking consistent growth.',
    riskLevel: 2
  },
  {
    id: '3',
    name: 'Premium Forex',
    tier: 'Premium',
    minInvestment: 5000,
    maxInvestment: 20000,
    dailyReturnRange: {
      min: 2,
      max: 4
    },
    durationDays: 90,
    description: 'Higher returns with moderate risk profile for experienced traders.',
    riskLevel: 3
  },
  {
    id: '4',
    name: 'Elite Trader',
    tier: 'Elite',
    minInvestment: 20000,
    maxInvestment: 100000,
    dailyReturnRange: {
      min: 3,
      max: 5
    },
    durationDays: 180,
    description: 'Our highest yield package for professional traders with higher risk tolerance.',
    riskLevel: 5
  }
];

// Mock user data
export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  balance: 25000,
  totalInvested: 15000,
  totalReturns: 2350
};

// Generate random daily returns for an investment
export const generateDailyReturns = (
  startDate: string,
  durationDays: number,
  amount: number,
  minReturn: number,
  maxReturn: number
): DailyReturn[] => {
  const returns: DailyReturn[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < durationDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + i);
    
    // If the date is in the future compared to now, stop generating
    if (currentDate > new Date()) break;
    
    const percentageReturn = minReturn + Math.random() * (maxReturn - minReturn);
    const dailyAmount = (amount * percentageReturn) / 100;
    
    returns.push({
      date: currentDate.toISOString(),
      amount: parseFloat(dailyAmount.toFixed(2)),
      percentage: parseFloat(percentageReturn.toFixed(2))
    });
  }
  
  return returns;
};

// Mock investments data
export const generateMockInvestments = (): Investment[] => {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);
  
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  return [
    {
      id: uuidv4(),
      userId: mockUser.id,
      packageId: '1',
      amount: 500,
      startDate: oneMonthAgo.toISOString(),
      endDate: new Date(oneMonthAgo.setDate(oneMonthAgo.getDate() + 30)).toISOString(),
      status: 'active' as const,
      totalReturn: 0, // Will be calculated
      dailyReturns: generateDailyReturns(
        oneMonthAgo.toISOString(),
        30,
        500,
        packages[0].dailyReturnRange.min,
        packages[0].dailyReturnRange.max
      )
    },
    {
      id: uuidv4(),
      userId: mockUser.id,
      packageId: '2',
      amount: 2500,
      startDate: twoWeeksAgo.toISOString(),
      endDate: new Date(twoWeeksAgo.setDate(twoWeeksAgo.getDate() + 60)).toISOString(),
      status: 'active' as const,
      totalReturn: 0, // Will be calculated
      dailyReturns: generateDailyReturns(
        twoWeeksAgo.toISOString(),
        60,
        2500,
        packages[1].dailyReturnRange.min,
        packages[1].dailyReturnRange.max
      )
    },
    {
      id: uuidv4(),
      userId: mockUser.id,
      packageId: '3',
      amount: 12000,
      startDate: oneWeekAgo.toISOString(),
      endDate: new Date(oneWeekAgo.setDate(oneWeekAgo.getDate() + 90)).toISOString(),
      status: 'active' as const,
      totalReturn: 0, // Will be calculated
      dailyReturns: generateDailyReturns(
        oneWeekAgo.toISOString(),
        90,
        12000,
        packages[2].dailyReturnRange.min,
        packages[2].dailyReturnRange.max
      )
    }
  ].map(investment => {
    // Calculate total return for each investment
    const totalReturn = investment.dailyReturns.reduce((sum, daily) => sum + daily.amount, 0);
    return {
      ...investment,
      totalReturn: parseFloat(totalReturn.toFixed(2))
    };
  });
};

// Mock investments
export let investments = generateMockInvestments();

// Generate investment stats
export const getInvestmentStats = (): Stats => {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;
  const totalEarned = investments.reduce((sum, inv) => sum + inv.totalReturn, 0);
  const averageReturn = totalInvested > 0 
    ? (totalEarned / totalInvested) * 100 
    : 0;
  
  return {
    totalInvested,
    activeInvestments,
    totalEarned,
    averageReturn: parseFloat(averageReturn.toFixed(2))
  };
};

// Make a new investment
export const createInvestment = (
  packageId: string,
  amount: number
): Investment => {
  const pkg = packages.find(p => p.id === packageId);
  if (!pkg) {
    throw new Error('Package not found');
  }

  if (amount < pkg.minInvestment || amount > pkg.maxInvestment) {
    throw new Error(`Investment must be between ${pkg.minInvestment} and ${pkg.maxInvestment}`);
  }

  const startDate = new Date().toISOString();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + pkg.durationDays);
  
  const newInvestment: Investment = {
    id: uuidv4(),
    userId: mockUser.id,
    packageId,
    amount,
    startDate,
    endDate: endDate.toISOString(),
    status: 'active',
    totalReturn: 0,
    dailyReturns: generateDailyReturns(
      startDate,
      pkg.durationDays,
      amount,
      pkg.dailyReturnRange.min,
      pkg.dailyReturnRange.max
    )
  };
  
  // Calculate total return
  newInvestment.totalReturn = newInvestment.dailyReturns.reduce(
    (sum, daily) => sum + daily.amount, 
    0
  );
  
  // Update user balances
  mockUser.balance -= amount;
  mockUser.totalInvested += amount;
  mockUser.totalReturns += newInvestment.totalReturn;
  
  // Add to investments array
  investments = [...investments, newInvestment];
  
  return newInvestment;
};

// Get investment by ID
export const getInvestmentById = (id: string): Investment | undefined => {
  return investments.find(inv => inv.id === id);
};

// Get package by ID
export const getPackageById = (id: string): Package | undefined => {
  return packages.find(pkg => pkg.id === id);
};
