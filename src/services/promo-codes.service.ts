import { apiClient } from '../lib/api-client';
import type { PromoCode, GeneratePromoCodesDto } from '../types/promo-code';
import type { PaginatedResult, PaginationParams } from '../types/pagination';

export const promoCodesService = {
  async generate(dto: GeneratePromoCodesDto): Promise<PromoCode[]> {
    const { data } = await apiClient.post<PromoCode[]>('/promo-codes', dto);
    return data;
  },

  async findMine(params: PaginationParams = {}): Promise<PaginatedResult<PromoCode>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCode>>(
      '/promo-codes/mine',
      { params },
    );
    return data;
  },

  async findForCampaign(
    campaignId: string,
    params: PaginationParams = {},
  ): Promise<PaginatedResult<PromoCode>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCode>>(
      `/promo-codes/campaign/${campaignId}`,
      { params },
    );
    return data;
  },
};
