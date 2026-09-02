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
  // numeric-поле из Postgres/TypeORM сериализуется в JSON как строка, не число
  discountValue: string;
  startsAt: string | null;
  // Абсолютная дата окончания кампании — не путать с ttlAmount/ttlUnit ниже
  expiresAt: string | null;
  // Относительный TTL: если задан, у каждого сгенерированного кода СВОЙ expiresAt,
  // отсчитанный от момента генерации (см. PromoCode.expiresAt)
  ttlAmount: number | null;
  ttlUnit: TtlUnit | null;
  totalCodesLimit: number | null;
  perCustomerLimit: number;
  // Дефолт maxRedemptions для кодов этой кампании. null = Unlimited в UI
  defaultMaxRedemptions: number | null;
  // Произвольные метаданные, копируются на каждый сгенерированный код
  payload: Record<string, unknown> | null;
  // Можно ли менять payload кода уже после генерации (PATCH /promo-codes/:id/payload)
  payloadMutable: boolean;
  // "Availability" в UI — разрешено ли SDK самому генерировать себе коды на лету
  // через POST /sdk/codes/generate. Отдельно от isActive — разные переключатели
  selfServeEnabled: boolean;
  isActive: boolean;
  adminMembershipId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt?: string;
  expiresAt?: string;
  // Оба поля обязательны вместе, если задано хотя бы одно
  ttlAmount?: number;
  ttlUnit?: TtlUnit;
  totalCodesLimit?: number;
  perCustomerLimit?: number;
  // Не передан = Unlimited, передано число = Custom
  defaultMaxRedemptions?: number;
  payload?: Record<string, unknown>;
  payloadMutable?: boolean;
  selfServeEnabled?: boolean;
  isActive?: boolean;
}

// isActive намеренно не включён — для него activate()/deactivate()
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

// Ответ GET /campaigns/:id/distributors — Distributor'ы, явно назначенные на кампанию.
// Без назначения Distributor не видит кампанию и не может по ней генерировать коды
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

export interface CampaignDistributorSummary {
  membershipId: string;
  // "Имя Фамилия", либо email как фолбэк, если участник не заполнил имя
  name: string;
}

// То, что реально отдаёт GET /campaigns — Campaign + агрегаты, посчитанные на бэке
// одним набором запросов (не N+1 на каждую строку списка)
export interface CampaignListItem extends Campaign {
  // Вычислено на бэке: archived (soft-deleted) > deactivated (isActive=false) > active
  displayStatus: CampaignStatusFilter;
  generated: number;
  // Все обращения к кодам кампании (validate + redeem), не только успешные погашения
  actions: number;
  redeemed: number;
  // Клиенты, чья самая первая активность за всю историю воркспейса пришлась
  // на код именно этой кампании
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

// То, что реально отдаёт GET /campaigns/:id — Campaign + вычисленный статус + автор
export interface CampaignDetail extends Campaign {
  displayStatus: CampaignStatusFilter;
  creator: CampaignCreatorInfo;
}
