import { apiClient } from '../lib/api-client';
import type { User } from '../types/user';
import type { PaginatedResult, PaginationParams } from '../types/pagination';
import type { InviteDto } from '../types';

export const usersService = {
  // Owner приглашает Admin'ов, Admin приглашает Distributor'ов —
  // кого конкретно создать, решает бэкенд по роли текущего пользователя
  async invite(dto: InviteDto): Promise<User> {
    const { data } = await apiClient.post<User>('/users/invite', dto);
    return data;
  },

  async getMyTeam(params: PaginationParams = {}): Promise<PaginatedResult<User>> {
    const { data } = await apiClient.get<PaginatedResult<User>>('/users/my-team', {
      params,
    });
    return data;
  },

  async resendInvite(userId: string): Promise<User> {
    const { data } = await apiClient.post<User>(`/users/${userId}/resend-invite`);
    return data;
  },

  async deactivate(userId: string): Promise<User> {
    const { data } = await apiClient.post<User>(`/users/${userId}/deactivate`);
    return data;
  },

  async activate(userId: string): Promise<User> {
    const { data } = await apiClient.post<User>(`/users/${userId}/activate`);
    return data;
  },

  async remove(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  },
};
