export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SimAccount {
  id: string;
  userId: string;
  initialBalance: number;
  currentBalance: number;
  equity: number;
  level: number;
  xp: number;
  dailyPnl: number;
  totalPnlPct: number;
  user: { name: string; email: string };
}

export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED' | 'SIMULATED';

export interface Trade {
  id: string;
  userId: string;
  type: TradeType;
  lot: number;
  entryPrice: number;
  exitPrice: number | null;
  sl: number | null;
  tp: number | null;
  resultUsd: number | null;
  resultPct: number | null;
  rrRatio: number | null;
  riskPct: number | null;
  status: TradeStatus;
  notes: string | null;
  entryAt: string;
  exitAt: string | null;
}

export interface SimulationResult {
  outcome: 'TP_HIT' | 'SL_HIT' | 'NEUTRAL';
  exitPrice: number;
  resultUsd: number;
  resultPct: number;
  rrRatio: number;
  riskPct: number;
  candlesTraversed: number;
  explanation: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: string;
  targetValue: number;
  xpReward: number;
  isDaily: boolean;
}

export interface UserMission {
  id: string;
  missionId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
  currentProgress: number;
  targetProgress: number;
  mission: Mission;
}

export interface Stats {
  winRate: number;
  totalPnl: number;
  avgPnl: number;
  avgRisk: number;
  avgRR: number;
  winStreak: number;
  lossStreak: number;
  totalTrades: number;
  wins: number;
  losses: number;
  behaviours: string[];
  weeklyPnl: { week: string; pnl: number }[];
  equityCurve: { date: string; balance: number }[];
  maxDrawdown: number;
}

export interface PriceTick {
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
