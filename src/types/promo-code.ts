export const PromoCodeStatus = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  EXHAUSTED: 'exhausted',
  EXPIRED: 'expired',
} as const;

export type PromoCodeStatus = (typeof PromoCodeStatus)[keyof typeof PromoCodeStatus];

export interface PromoCode {
  id: string;
  code: string;
  campaignId: string;
  distributorMembershipId: string;
  // null = безлимитный код (Unlimited)
  maxRedemptions: number | null;
  redemptionsCount: number;
  // Собственный срок жизни кода — заполнен, только если кампания использует TTL
  // (см. Campaign.ttlAmount/ttlUnit). Если null — действует campaign.expiresAt
  expiresAt: string | null;
  payload: Record<string, unknown> | null;
  status: PromoCodeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePromoCodesDto {
  campaignId: string;
  count?: number; // сколько кодов сгенерировать, по умолчанию 1
  // Override дефолта кампании (Campaign.defaultMaxRedemptions).
  // Явный null тоже работает — это override "сделать именно эти коды безлимитными",
  // даже если у кампании задан конечный defaultMaxRedemptions
  maxRedemptions?: number | null;
}

export interface UpdatePromoCodePayloadDto {
  payload: Record<string, unknown>;
}
