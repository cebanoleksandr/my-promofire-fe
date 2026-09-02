import { apiClient } from '../lib/api-client';
import type { Membership, TeamMember, InviteDto, Role } from '../types/membership';
import type { PaginatedResult, PaginationParams } from '../types/pagination';
import type { DateRangeParams } from '../types/date-range';

export interface GetMyTeamParams extends PaginationParams, DateRangeParams {
  // Показать только конкретную роль — например, для секции Team на странице Profile
  role?: Role;
}

export const membershipsService = {
  // Owner приглашает Admin'ов, Admin приглашает Distributor'ов —
  // в ТЕКУЩИЙ активный воркспейс (тот, что зашит в JWT)
  async invite(dto: InviteDto): Promise<Membership> {
    const { data } = await apiClient.post<Membership>('/memberships/invite', dto);
    return data;
  },

  // Единственный эндпоинт, который возвращает email (через join с Account на бэке).
  // Без params.period — вернутся все участники без фильтра по дате приглашения.
  // Без params.role — вернутся все роли вперемешку (Admin'ы и Distributor'ы разом)
  async getMyTeam(params: GetMyTeamParams = {}): Promise<PaginatedResult<TeamMember>> {
    const { data } = await apiClient.get<PaginatedResult<TeamMember>>(
      '/memberships/my-team',
      { params },
    );
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
