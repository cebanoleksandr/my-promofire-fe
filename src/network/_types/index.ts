export const EQueries = {
  CURRENT_USER: 'current-user',
  CAMPAIGNS: 'campaigns',
  CAMPAIGN: 'campaign',
  PROMO_CODES_MINE: 'promo-codes-mine',
  PROMO_CODES_CAMPAIGN: 'promo-codes-campaign',
  INTEGRATIONS: 'integrations',
  MY_TEAM: 'my-team',
  STATS_OVERVIEW: 'stats-overview',
} as const;

export type EQueries = (typeof EQueries)[keyof typeof EQueries];

import type { PaginationParams } from '../../types';

// Централизованные query-ключи: используем и для useQuery, и для invalidateQueries
export const queryKeys = {
  currentUser: () => [EQueries.CURRENT_USER] as const,

  campaigns: (params?: PaginationParams) =>
    [EQueries.CAMPAIGNS, params ?? {}] as const,
  campaign: (id: string) => [EQueries.CAMPAIGN, id] as const,

  promoCodesMine: (params?: PaginationParams) =>
    [EQueries.PROMO_CODES_MINE, params ?? {}] as const,
  promoCodesForCampaign: (campaignId: string, params?: PaginationParams) =>
    [EQueries.PROMO_CODES_CAMPAIGN, campaignId, params ?? {}] as const,

  integrations: () => [EQueries.INTEGRATIONS] as const,

  myTeam: (params?: PaginationParams) => [EQueries.MY_TEAM, params ?? {}] as const,

  statsOverview: () => [EQueries.STATS_OVERVIEW] as const,
};
