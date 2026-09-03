import { apiClient } from '../lib/api-client';
import type {
  PromoCode,
  PromoCodeListItem,
  PromoCodeDetail,
  PromoCodeListParams,
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

  async updatePayload(id: string, dto: UpdatePromoCodePayloadDto): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/promo-codes/${id}/payload`, dto);
    return data;
  },

  async disable(id: string): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/promo-codes/${id}/disable`);
    return data;
  },

  async enable(id: string): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/promo-codes/${id}/enable`);
    return data;
  },

  // Підтримує пагінацію, фільтр по даті та опціональний фільтр за distributorMembershipId
  async findAll(
    params: PaginationParams & DateRangeParams & PromoCodeListParams = {},
  ): Promise<PaginatedResult<PromoCodeListItem>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCodeListItem>>('/promo-codes', {
      params,
    });
    return data;
  },

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

  async findOne(id: string): Promise<PromoCodeDetail> {
    const { data } = await apiClient.get<PromoCodeDetail>(`/promo-codes/${id}`);
    return data;
  },
};
