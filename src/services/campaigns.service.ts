import { apiClient } from '../lib/api-client';
import type {
  Campaign,
  CreateCampaignDto,
  AssignDistributorDto,
  AssignedDistributor,
} from '../types/campaign';
import type { PaginatedResult, PaginationParams } from '../types/pagination';

export const campaignsService = {
  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const { data } = await apiClient.post<Campaign>('/campaigns', dto);
    return data;
  },

  // Owner видит все кампании воркспейса. Admin — свои + кампании Owner'а.
  // Distributor не видит НИЧЕГО автоматически — только кампании, на которые
  // его явно назначили (см. assignDistributor/getAssignedDistributors ниже)
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

  // Owner может назначить любого Distributor'а воркспейса, Admin — только своих
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
