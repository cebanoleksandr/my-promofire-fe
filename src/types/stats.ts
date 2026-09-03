export const StatsPeriod = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  ALL: 'all',
  CUSTOM: 'custom',
} as const;

export type StatsPeriod = (typeof StatsPeriod)[keyof typeof StatsPeriod];

export interface StatsRangeParams {
  period?: StatsPeriod;
  from?: string;
  to?: string;
  campaignId?: string;
  // Звузити статистику до одного коду (сторінка деталей промокоду)
  promoCodeId?: string;
  // Звузити статистику до промокодів конкретного Distributor'а (сторінка деталей дистриб'ютора)
  distributorMembershipId?: string;
}

export interface CodesStatsPoint {
  date: string;
  generated: number;
  redeemed: number;
  expired: number;
  actions: number;
}

export interface CodesStatsResponse {
  totals: {
    generated: number;
    generatedChangePct: number;
    redeemed: number;
    redeemedChangePct: number;
    expired: number;
    expiredChangePct: number;
    actions: number;
    actionsChangePct: number;
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
  key: string;
  count: number;
  percentage: number;
}

export interface BreakdownResponse {
  items: BreakdownItem[];
  total: number;
}

export interface DistributorCampaignBreakdown {
  campaignId: string;
  name: string;
  generated: number;
  redeemed: number;
  actions: number;
  newUsers: number;
}

export interface DistributorBreakdown {
  membershipId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  isActive: boolean;
  campaigns: DistributorCampaignBreakdown[];
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

export type StatsOverview = OwnerOverview | AdminOverview | DistributorOverview;
