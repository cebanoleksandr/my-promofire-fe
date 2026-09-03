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
  // null = сгенерирован напрямую Owner'ом/Admin'ом, без привязки к конкретному
  // Distributor'у. Кто может погасить код, определяется не этим полем, а тем,
  // назначен ли Distributor интеграции на кампанию (см. CampaignDistributor)
  distributorMembershipId: string | null;
  // Заполнено, только если код сгенерирован самим SDK через self-serve
  // (POST /sdk/codes/generate), а не вручную Distributor'ом через панель
  generatedByIntegrationId: string | null;
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
  // "Custom" в UI — весь код целиком задаётся вручную (3-32 символа: буквы,
  // цифры, дефис, подчёркивание). Работает только вместе с count=1 (или без count) —
  // бэк вернёт 400 при попытке сочетать с count > 1, и 409, если такой код уже занят
  customCode?: string;
}

export interface UpdatePromoCodePayloadDto {
  payload: Record<string, unknown>;
}

// Отдельно от PromoCodeStatus (то, что хранится в БД как есть) — этот вычисляется
// на бэке при листинге и учитывает истечение срока, которое в саму колонку status
// никогда не записывается
export const PromoCodeDisplayStatus = {
  ACTIVE: 'active',
  DEACTIVATED: 'deactivated',
  // Полностью исчерпан лимит (maxRedemptions). Безлимитный код (maxRedemptions: null)
  // никогда не станет "redeemed", даже если его гасили много раз — навсегда "active"
  REDEEMED: 'redeemed',
  EXPIRED: 'expired',
} as const;

export type PromoCodeDisplayStatus =
  (typeof PromoCodeDisplayStatus)[keyof typeof PromoCodeDisplayStatus];

// То, что реально отдаёт GET /promo-codes/* — PromoCode + агрегаты, посчитанные
// на бэке одним набором запросов (не N+1 на каждую строку списка)
export interface PromoCodeListItem extends PromoCode {
  displayStatus: PromoCodeDisplayStatus;
  // Все обращения к коду (validate + redeem), не только успешные погашения
  actions: number;
  // Клиенты, чья самая первая активность за всю историю воркспейса пришлась
  // именно на этот код
  newUsers: number;
  // "До какого момента код живёт" — свой expiresAt, а если его нет — от кампании
  lifetime: string | null;
}
