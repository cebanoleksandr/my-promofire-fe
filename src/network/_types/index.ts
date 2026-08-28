import type { PaginationParams } from '../../types';

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
} as const;

export type EQueries = (typeof EQueries)[keyof typeof EQueries];

// Централизованные query-ключи: используем и для useQuery, и для invalidateQueries
export const queryKeys = {
  currentAccount: () => [EQueries.CURRENT_ACCOUNT] as const,
  currentWorkspace: () => [EQueries.CURRENT_WORKSPACE] as const,
  workspacesMine: () => [EQueries.WORKSPACES_MINE] as const,

  myTeam: (params?: PaginationParams) => [EQueries.MY_TEAM, params ?? {}] as const,

  campaigns: (params?: PaginationParams) =>
    [EQueries.CAMPAIGNS, params ?? {}] as const,
  campaign: (id: string) => [EQueries.CAMPAIGN, id] as const,

  promoCodesMine: (params?: PaginationParams) =>
    [EQueries.PROMO_CODES_MINE, params ?? {}] as const,
  promoCodesForCampaign: (campaignId: string, params?: PaginationParams) =>
    [EQueries.PROMO_CODES_CAMPAIGN, campaignId, params ?? {}] as const,

  integrations: () => [EQueries.INTEGRATIONS] as const,

  statsOverview: () => [EQueries.STATS_OVERVIEW] as const,
};
