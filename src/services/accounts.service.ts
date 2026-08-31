import { apiClient } from '../lib/api-client';
import type { AccountProfile, UpdateProfileDto } from '../types/account';

export const accountsService = {
  async getProfile(): Promise<AccountProfile> {
    const { data } = await apiClient.get<AccountProfile>('/accounts/me');
    return data;
  },

  async updateProfile(dto: UpdateProfileDto): Promise<AccountProfile> {
    const { data } = await apiClient.patch<AccountProfile>('/accounts/me', dto);
    return data;
  },
};
