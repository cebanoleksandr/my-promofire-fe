import { apiClient } from '../lib/api-client';
import type { Campaign, CreateCampaignDto } from '../types/campaign';
import type { PaginatedResult, PaginationParams } from '../types/pagination';

export const campaignsService = {
  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const { data } = await apiClient.post<Campaign>('/campaigns', dto);
    return data;
  },

  // Owner видит все, Admin — свои, Distributor — кампании своего Admin'а
  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<Campaign>> {
    const { data } = await apiClient.get<PaginatedResult<Campaign>>('/campaigns', {
      params,
    });
    return data;
  },

  async findOne(id: string): Promise<Campaign> {
    const { data } = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return data;
  },

  async activate(id: string): Promise<Campaign> {
    const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}/activate`);
    return data;
  },

  async deactivate(id: string): Promise<Campaign> {
    const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}/deactivate`);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/campaigns/${id}`);
  },
};
