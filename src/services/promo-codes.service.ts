import { apiClient } from '../lib/api-client';
import type {
  PromoCode,
  PromoCodeListItem,
  GeneratePromoCodesDto,
  UpdatePromoCodePayloadDto,
} from '../types/promo-code';
import type { PaginatedResult, PaginationParams } from '../types/pagination';
import type { DateRangeParams } from '../types/date-range';

export const promoCodesService = {
  async generate(dto: GeneratePromoCodesDto): Promise<PromoCode[]> {
    const { data } = await apiClient.post<PromoCode[]>('/promo-codes', dto);
    return data;
  },

  // Работает, только если у кампании кода payloadMutable === true — иначе 403
  async updatePayload(id: string, dto: UpdatePromoCodePayloadDto): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/promo-codes/${id}/payload`, dto);
    return data;
  },

  async disable(id: string): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/promo-codes/${id}/disable`);
    return data;
  },

  // Работает, только если код был именно вручную отключён (не исчерпан, не истёк)
  async enable(id: string): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/promo-codes/${id}/enable`);
    return data;
  },

  // Owner видит все коды воркспейса, Admin — коды своих кампаний, Distributor — свои
  async findAll(
    params: PaginationParams & DateRangeParams = {},
  ): Promise<PaginatedResult<PromoCodeListItem>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCodeListItem>>('/promo-codes', {
      params,
    });
    return data;
  },

  // Без params.period — вернутся все коды без фильтра по дате
  async findMine(
    params: PaginationParams & DateRangeParams = {},
  ): Promise<PaginatedResult<PromoCodeListItem>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCodeListItem>>(
      '/promo-codes/mine',
      { params },
    );
    return data;
  },

  async findForCampaign(
    campaignId: string,
    params: PaginationParams & DateRangeParams = {},
  ): Promise<PaginatedResult<PromoCodeListItem>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCodeListItem>>(
      `/promo-codes/campaign/${campaignId}`,
      { params },
    );
    return data;
  },
};
