import type { PaginationParams } from '../../types';
import type { DateRangeParams } from '../../types/date-range';
import type { StatsRangeParams } from '../../types/stats';
import type { CampaignStatusFilter } from '../../types/campaign';
import type { Role } from '../../types/membership';

type ListParams = PaginationParams & DateRangeParams;
type CampaignListParams = PaginationParams & { status?: CampaignStatusFilter };
type MyTeamParams = ListParams & { role?: Role };

export const EQueries = {
  CURRENT_ACCOUNT: 'current-account',
  ACCOUNT_PROFILE: 'account-profile',
  CURRENT_WORKSPACE: 'current-workspace',
  WORKSPACES_MINE: 'workspaces-mine',
  MY_TEAM: 'my-team',
  CAMPAIGNS: 'campaigns',
  CAMPAIGN: 'campaign',
  CAMPAIGN_DISTRIBUTORS: 'campaign-distributors',
  PROMO_CODES: 'promo-codes',
  PROMO_CODES_MINE: 'promo-codes-mine',
  PROMO_CODES_CAMPAIGN: 'promo-codes-campaign',
  INTEGRATIONS: 'integrations',
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

  campaigns: (params?: CampaignListParams) =>
    [EQueries.CAMPAIGNS, params ?? {}] as const,
  campaign: (id: string) => [EQueries.CAMPAIGN, id] as const,
  campaignDistributors: (campaignId: string) =>
    [EQueries.CAMPAIGN_DISTRIBUTORS, campaignId] as const,

  promoCodes: (params?: ListParams) =>
    [EQueries.PROMO_CODES, params ?? {}] as const,
  promoCodesMine: (params?: ListParams) =>
    [EQueries.PROMO_CODES_MINE, params ?? {}] as const,
  promoCodesForCampaign: (campaignId: string, params?: ListParams) =>
    [EQueries.PROMO_CODES_CAMPAIGN, campaignId, params ?? {}] as const,

  integrations: (params?: DateRangeParams) =>
    [EQueries.INTEGRATIONS, params ?? {}] as const,

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
