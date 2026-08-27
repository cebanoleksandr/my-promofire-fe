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
  distributorId: string;
  maxRedemptions: number;
  redemptionsCount: number;
  status: PromoCodeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePromoCodesDto {
  campaignId: string;
  count?: number; // сколько кодов сгенерировать, по умолчанию 1
  maxRedemptions?: number; // по умолчанию 1 (одноразовый код)
}
