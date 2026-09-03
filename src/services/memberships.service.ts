import { apiClient } from '../lib/api-client';
import type {
  Membership,
  TeamMember,
  DistributorDetail,
  UpdateDistributorDetailDto,
  InviteDto,
  Role,
} from '../types/membership';
import type { PaginatedResult, PaginationParams } from '../types/pagination';
import type { DateRangeParams } from '../types/date-range';

export interface GetMyTeamParams extends PaginationParams, DateRangeParams {
  role?: Role;
}

export const membershipsService = {
  async invite(dto: InviteDto): Promise<Membership> {
    const { data } = await apiClient.post<Membership>('/memberships/invite', dto);
    return data;
  },

  async getMyTeam(params: GetMyTeamParams = {}): Promise<PaginatedResult<TeamMember>> {
    const { data } = await apiClient.get<PaginatedResult<TeamMember>>(
      '/memberships/my-team',
      { params },
    );
    return data;
  },

  // Отримання деталей Distributor'а для шапки сторінки (профіль + editable description)
  async getDistributor(id: string): Promise<DistributorDetail> {
    const { data } = await apiClient.get<DistributorDetail>(`/memberships/${id}`);
    return data;
  },

  // Оновлення опису Distributor'а
  async updateDistributor(
    id: string,
    dto: UpdateDistributorDetailDto,
  ): Promise<DistributorDetail> {
    const { data } = await apiClient.patch<DistributorDetail>(`/memberships/${id}`, dto);
    return data;
  },

  async resendInvite(membershipId: string): Promise<Membership> {
    const { data } = await apiClient.post<Membership>(
      `/memberships/${membershipId}/resend-invite`,
    );
    return data;
  },

  async deactivate(membershipId: string): Promise<Membership> {
    const { data } = await apiClient.post<Membership>(
      `/memberships/${membershipId}/deactivate`,
    );
    return data;
  },

  async activate(membershipId: string): Promise<Membership> {
    const { data } = await apiClient.post<Membership>(
      `/memberships/${membershipId}/activate`,
    );
    return data;
  },

  async remove(membershipId: string): Promise<void> {
    await apiClient.delete(`/memberships/${membershipId}`);
  },
};
