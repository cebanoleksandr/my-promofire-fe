import { apiClient } from '../lib/api-client';
import type { PromoCode, GeneratePromoCodesDto } from '../types/promo-code';
import type { PaginatedResult, PaginationParams } from '../types/pagination';
import type { DateRangeParams } from '../types/date-range';

export const promoCodesService = {
  async generate(dto: GeneratePromoCodesDto): Promise<PromoCode[]> {
    const { data } = await apiClient.post<PromoCode[]>('/promo-codes', dto);
    return data;
  },

  // Owner видит все коды воркспейса, Admin — коды своих кампаний, Distributor — свои
  async findAll(
    params: PaginationParams & DateRangeParams = {},
  ): Promise<PaginatedResult<PromoCode>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCode>>('/promo-codes', {
      params,
    });
    return data;
  },

  // Без params.period — вернутся все коды без фильтра по дате
  async findMine(
    params: PaginationParams & DateRangeParams = {},
  ): Promise<PaginatedResult<PromoCode>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCode>>(
      '/promo-codes/mine',
      { params },
    );
    return data;
  },

  async findForCampaign(
    campaignId: string,
    params: PaginationParams & DateRangeParams = {},
  ): Promise<PaginatedResult<PromoCode>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCode>>(
      `/promo-codes/campaign/${campaignId}`,
      { params },
    );
    return data;
  },
};
