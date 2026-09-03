import { apiClient } from '../lib/api-client';
import type {
  Campaign,
  CampaignDetail,
  CampaignListItem,
  CampaignListParams,
  CreateCampaignDto,
  UpdateCampaignDto,
  AssignDistributorDto,
  AssignedDistributor,
} from '../types/campaign';
import type { PaginatedResult, PaginationParams } from '../types/pagination';

export const campaignsService = {
  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const { data } = await apiClient.post<Campaign>('/campaigns', dto);
    return data;
  },

  // Підтримує пагінацію, фільтр за статусом (active | deactivated | archived)
  // та необов'язковий фільтр за distributorMembershipId
  async findAll(
    params: PaginationParams & CampaignListParams = {},
  ): Promise<PaginatedResult<CampaignListItem>> {
    const { data } = await apiClient.get<PaginatedResult<CampaignListItem>>('/campaigns', {
      params,
    });
    return data;
  },

  async findOne(id: string): Promise<CampaignDetail> {
    const { data } = await apiClient.get<CampaignDetail>(`/campaigns/${id}`);
    return data;
  },

  async update(id: string, dto: UpdateCampaignDto): Promise<Campaign> {
    const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}`, dto);
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

  async restore(id: string): Promise<Campaign> {
    const { data } = await apiClient.post<Campaign>(`/campaigns/${id}/restore`);
    return data;
  },

  async assignDistributor(campaignId: string, dto: AssignDistributorDto): Promise<void> {
    await apiClient.post(`/campaigns/${campaignId}/distributors`, dto);
  },

  async unassignDistributor(
    campaignId: string,
    distributorMembershipId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/campaigns/${campaignId}/distributors/${distributorMembershipId}`,
    );
  },

  async getAssignedDistributors(campaignId: string): Promise<AssignedDistributor[]> {
    const { data } = await apiClient.get<AssignedDistributor[]>(
      `/campaigns/${campaignId}/distributors`,
    );
    return data;
  },
};
