export const StatsPeriod = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter', // 3 месяца
  YEAR: 'year',
  ALL: 'all',
  CUSTOM: 'custom',
} as const;

export type StatsPeriod = (typeof StatsPeriod)[keyof typeof StatsPeriod];

export interface StatsRangeParams {
  period?: StatsPeriod;
  // Обязателен, только если period === 'custom'. Формат YYYY-MM-DD.
  from?: string;
  to?: string;
}

export interface CodesStatsPoint {
  date: string; // YYYY-MM-DD
  generated: number;
  redeemed: number;
  expired: number;
}

export interface CodesStatsResponse {
  totals: {
    generated: number;
    generatedChangePct: number;
    redeemed: number;
    redeemedChangePct: number;
    expired: number;
    expiredChangePct: number;
  };
  series: CodesStatsPoint[];
}

export interface UsersStatsPoint {
  date: string;
  active: number;
  new: number;
}

export interface UsersStatsResponse {
  totals: {
    all: number;
    allChangePct: number;
    active: number;
    activeChangePct: number;
    new: number;
    newChangePct: number;
  };
  series: UsersStatsPoint[];
}

export interface BreakdownItem {
  // Код страны (ISO 3166-1 alpha-2, напр. "PL") для countries,
  // или "ios" | "android" | "web" для devices. "unknown" — если SDK не передал значение.
  key: string;
  count: number;
  percentage: number; // 0-100, округлено
}

export interface BreakdownResponse {
  items: BreakdownItem[];
  total: number;
}

export interface OwnerOverview {
  scope: 'owner';
  totalAdmins: number;
  totalDistributors: number;
  totalCampaigns: number;
  totalPromoCodes: number;
  totalRedemptions: number;
}

export interface AdminCampaignStat {
  campaignId: string;
  name: string;
  isActive: boolean;
  codesIssued: number;
  redemptions: number;
}

export interface AdminOverview {
  scope: 'admin';
  totalCampaigns: number;
  totalPromoCodes: number;
  totalRedemptions: number;
  campaigns: AdminCampaignStat[];
}

export interface DistributorIntegrationStat {
  integrationId: string;
  name: string;
  redemptions: number;
}

export interface DistributorOverview {
  scope: 'distributor';
  totalPromoCodes: number;
  totalRedemptions: number;
  byIntegration: DistributorIntegrationStat[];
}

// Различаем по полю scope — узкий тип сам сузится в switch/if по discriminant union
export type StatsOverview = OwnerOverview | AdminOverview | DistributorOverview;
