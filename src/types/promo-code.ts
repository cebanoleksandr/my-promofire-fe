import type { Role } from "./membership";

export const PromoCodeStatus = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  EXHAUSTED: 'exhausted',
} as const;

export type PromoCodeStatus = (typeof PromoCodeStatus)[keyof typeof PromoCodeStatus];

export interface PromoCode {
  id: string;
  code: string;
  campaignId: string;
  distributorMembershipId: string | null;
  generatedByIntegrationId: string | null;
  maxRedemptions: number | null;
  redemptionsCount: number;
  expiresAt: string | null;
  payload: Record<string, unknown> | null;
  status: PromoCodeStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface GeneratePromoCodesDto {
  campaignId: string;
  count?: number;
  maxRedemptions?: number | null;
  customCode?: string;
}

export interface UpdatePromoCodePayloadDto {
  payload: Record<string, unknown>;
}

export const PromoCodeDisplayStatus = {
  ACTIVE: 'active',
  DEACTIVATED: 'deactivated',
  REDEEMED: 'redeemed',
  EXPIRED: 'expired',
} as const;

export type PromoCodeDisplayStatus =
  (typeof PromoCodeDisplayStatus)[keyof typeof PromoCodeDisplayStatus];

export interface PromoCodeListParams {
  // Фільтр: промокоди, згенеровані конкретним Distributor'ом (для сторінки деталей дистриб'ютора)
  distributorMembershipId?: string;
}

export interface PromoCodeListItem extends PromoCode {
  displayStatus: PromoCodeDisplayStatus;
  actions: number;
  newUsers: number;
  lifetime: string | null;
}

export interface PromoCodeIntegrationBreakdown {
  integrationId: string;
  name: string;
  actions: number;
  generated: number;
}

export interface PromoCodeCreator {
  membershipId: string;
  role: Role;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
}

export interface PromoCodeDetail extends Omit<PromoCode, 'campaign'> {
  displayStatus: PromoCodeDisplayStatus;
  lifetime: string | null;
  creator: PromoCodeCreator | null;
  campaign: {
    id: string;
    name: string;
    description: string | null;
  };
  integrations: PromoCodeIntegrationBreakdown[];
}
