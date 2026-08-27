import { apiClient } from '../lib/api-client';
import type { StatsOverview } from '../types/stats';

export const statsService = {
  // Форма ответа зависит от роли текущего пользователя — см. discriminant union StatsOverview
  async getOverview(): Promise<StatsOverview> {
    const { data } = await apiClient.get<StatsOverview>('/stats/overview');
    return data;
  },
};
