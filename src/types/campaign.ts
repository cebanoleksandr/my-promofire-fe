export const DiscountType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export const TtlUnit = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month',
} as const;

export type TtlUnit = (typeof TtlUnit)[keyof typeof TtlUnit];

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  // numeric-поле з Postgres/TypeORM серіалізується в JSON як рядок
  discountValue: string;
  startsAt: string | null;
  // Абсолютна дата завершення кампанії
  expiresAt: string | null;
  // Відносний TTL коду від моменту генерації
  ttlAmount: number | null;
  ttlUnit: TtlUnit | null;
  totalCodesLimit: number | null;
  perCustomerLimit: number;
  // Дефолт maxRedemptions для кодів. null = Unlimited
  defaultMaxRedemptions: number | null;
  payload: Record<string, unknown> | null;
  payloadMutable: boolean;
  selfServeEnabled: boolean;
  isActive: boolean;
  adminMembershipId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt?: string;
  expiresAt?: string;
  ttlAmount?: number;
  ttlUnit?: TtlUnit;
  totalCodesLimit?: number;
  perCustomerLimit?: number;
  defaultMaxRedemptions?: number;
  payload?: Record<string, unknown>;
  payloadMutable?: boolean;
  selfServeEnabled?: boolean;
  isActive?: boolean;
}

export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  startsAt?: string;
  expiresAt?: string;
  ttlAmount?: number;
  ttlUnit?: TtlUnit;
  totalCodesLimit?: number;
  perCustomerLimit?: number;
  defaultMaxRedemptions?: number;
  payload?: Record<string, unknown>;
  payloadMutable?: boolean;
  selfServeEnabled?: boolean;
}

export interface AssignDistributorDto {
  distributorMembershipId: string;
}

export interface AssignedDistributor {
  membershipId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  isActive: boolean;
  assignedAt: string;
}

export const CampaignStatusFilter = {
  ACTIVE: 'active',
  DEACTIVATED: 'deactivated',
  ARCHIVED: 'archived',
} as const;

export type CampaignStatusFilter = (typeof CampaignStatusFilter)[keyof typeof CampaignStatusFilter];

export interface CampaignListParams {
  status?: CampaignStatusFilter;
  // Фільтр: кампанії, на які призначено зазначеного Distributor'а
  distributorMembershipId?: string;
}

export interface CampaignDistributorSummary {
  membershipId: string;
  name: string;
}

export interface CampaignListItem extends Campaign {
  displayStatus: CampaignStatusFilter;
  generated: number;
  actions: number;
  redeemed: number;
  newUsers: number;
  distributors: CampaignDistributorSummary[];
}

export interface CampaignCreatorInfo {
  membershipId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
}

export interface CampaignDetail extends Campaign {
  displayStatus: CampaignStatusFilter;
  creator: CampaignCreatorInfo;
}
