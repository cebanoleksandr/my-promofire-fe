import type { PaginationParams } from '../../types';
import type { DateRangeParams } from '../../types/date-range';
import type { StatsRangeParams } from '../../types/stats';

type ListParams = PaginationParams & DateRangeParams;

export const EQueries = {
  CURRENT_ACCOUNT: 'current-account',
  CURRENT_WORKSPACE: 'current-workspace',
  WORKSPACES_MINE: 'workspaces-mine',
  MY_TEAM: 'my-team',
  CAMPAIGNS: 'campaigns',
  CAMPAIGN: 'campaign',
  PROMO_CODES_MINE: 'promo-codes-mine',
  PROMO_CODES_CAMPAIGN: 'promo-codes-campaign',
  INTEGRATIONS: 'integrations',
  STATS_OVERVIEW: 'stats-overview',
  STATS_CODES: 'stats-codes',
  STATS_USERS: 'stats-users',
  STATS_COUNTRIES: 'stats-countries',
  STATS_DEVICES: 'stats-devices',
} as const;

export type EQueries = (typeof EQueries)[keyof typeof EQueries];

// Централизованные query-ключи: используем и для useQuery, и для invalidateQueries
export const queryKeys = {
  currentAccount: () => [EQueries.CURRENT_ACCOUNT] as const,
  currentWorkspace: () => [EQueries.CURRENT_WORKSPACE] as const,
  workspacesMine: () => [EQueries.WORKSPACES_MINE] as const,

  myTeam: (params?: ListParams) => [EQueries.MY_TEAM, params ?? {}] as const,

  campaigns: (params?: PaginationParams) =>
    [EQueries.CAMPAIGNS, params ?? {}] as const,
  campaign: (id: string) => [EQueries.CAMPAIGN, id] as const,

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
};
