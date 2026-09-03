import type { PaginationParams } from '../../types';
import type { DateRangeParams } from '../../types/date-range';
import type { StatsRangeParams } from '../../types/stats';
import type { CampaignListParams as CampaignFilterParams } from '../../types/campaign';
import type { PromoCodeListParams } from '../../types/promo-code';
import type { CustomerRangeParams } from '../../types/customer';
import type { Role } from '../../types/membership';

type ListParams = PaginationParams & DateRangeParams;
type CampaignListParams = PaginationParams & CampaignFilterParams;
type PromoCodesListParams = ListParams & PromoCodeListParams;
type MyTeamParams = ListParams & { role?: Role };
type CustomerCodesParams = PaginationParams & CustomerRangeParams;

export const EQueries = {
  CURRENT_ACCOUNT: 'current-account',
  ACCOUNT_PROFILE: 'account-profile',
  CURRENT_WORKSPACE: 'current-workspace',
  WORKSPACES_MINE: 'workspaces-mine',
  MY_TEAM: 'my-team',
  DISTRIBUTOR: 'distributor',
  CAMPAIGNS: 'campaigns',
  CAMPAIGN: 'campaign',
  CAMPAIGN_DISTRIBUTORS: 'campaign-distributors',
  PROMO_CODE: 'promo-code',
  PROMO_CODES: 'promo-codes',
  PROMO_CODES_MINE: 'promo-codes-mine',
  PROMO_CODES_CAMPAIGN: 'promo-codes-campaign',
  INTEGRATIONS: 'integrations',
  CUSTOMERS: 'customers',
  CUSTOMER: 'customer',
  CUSTOMER_DEVICES: 'customer-devices',
  CUSTOMER_COUNTRIES: 'customer-countries',
  CUSTOMER_CODES: 'customer-codes',
  STATS_OVERVIEW: 'stats-overview',
  STATS_CODES: 'stats-codes',
  STATS_USERS: 'stats-users',
  STATS_COUNTRIES: 'stats-countries',
  STATS_DEVICES: 'stats-devices',
  STATS_DISTRIBUTORS: 'stats-distributors',
} as const;

export type EQueries = (typeof EQueries)[keyof typeof EQueries];

// Централизованные query-ключи: используем и для useQuery, и для invalidateQueries
export const queryKeys = {
  currentAccount: () => [EQueries.CURRENT_ACCOUNT] as const,
  accountProfile: () => [EQueries.ACCOUNT_PROFILE] as const,
  currentWorkspace: () => [EQueries.CURRENT_WORKSPACE] as const,
  workspacesMine: () => [EQueries.WORKSPACES_MINE] as const,

  myTeam: (params?: MyTeamParams) => [EQueries.MY_TEAM, params ?? {}] as const,
  distributor: (id: string) => [EQueries.DISTRIBUTOR, id] as const,

  campaigns: (params?: CampaignListParams) =>
    [EQueries.CAMPAIGNS, params ?? {}] as const,
  campaign: (id: string) => [EQueries.CAMPAIGN, id] as const,
  campaignDistributors: (campaignId: string) =>
    [EQueries.CAMPAIGN_DISTRIBUTORS, campaignId] as const,

  promoCode: (id: string) => [EQueries.PROMO_CODE, id] as const,
  promoCodes: (params?: PromoCodesListParams) =>
    [EQueries.PROMO_CODES, params ?? {}] as const,
  promoCodesMine: (params?: ListParams) =>
    [EQueries.PROMO_CODES_MINE, params ?? {}] as const,
  promoCodesForCampaign: (campaignId: string, params?: ListParams) =>
    [EQueries.PROMO_CODES_CAMPAIGN, campaignId, params ?? {}] as const,

  integrations: (params?: DateRangeParams) =>
    [EQueries.INTEGRATIONS, params ?? {}] as const,

  customers: (params?: PaginationParams) =>
    [EQueries.CUSTOMERS, params ?? {}] as const,
  customer: (id: string, params?: CustomerRangeParams) =>
    [EQueries.CUSTOMER, id, params ?? {}] as const,
  customerDevices: (id: string, params?: CustomerRangeParams) =>
    [EQueries.CUSTOMER_DEVICES, id, params ?? {}] as const,
  customerCountries: (id: string, params?: CustomerRangeParams) =>
    [EQueries.CUSTOMER_COUNTRIES, id, params ?? {}] as const,
  customerCodes: (id: string, params?: CustomerCodesParams) =>
    [EQueries.CUSTOMER_CODES, id, params ?? {}] as const,

  statsOverview: () => [EQueries.STATS_OVERVIEW] as const,
  statsCodes: (params?: StatsRangeParams) =>
    [EQueries.STATS_CODES, params ?? {}] as const,
  statsUsers: (params?: StatsRangeParams) =>
    [EQueries.STATS_USERS, params ?? {}] as const,
  statsCountries: (params?: StatsRangeParams) =>
    [EQueries.STATS_COUNTRIES, params ?? {}] as const,
  statsDevices: (params?: StatsRangeParams) =>
    [EQueries.STATS_DEVICES, params ?? {}] as const,
  statsDistributors: (params?: StatsRangeParams) =>
    [EQueries.STATS_DISTRIBUTORS, params ?? {}] as const,
};
