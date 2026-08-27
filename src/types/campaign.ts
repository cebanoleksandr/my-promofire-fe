export const DiscountType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export interface Campaign {
  id: string;
  name: string;
  discountType: DiscountType;
  // numeric-поле из Postgres/TypeORM сериализуется в JSON как строка, не число
  discountValue: string;
  startsAt: string | null;
  expiresAt: string | null;
  totalCodesLimit: number | null;
  perCustomerLimit: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt?: string;
  expiresAt?: string;
  totalCodesLimit?: number;
  perCustomerLimit?: number;
}