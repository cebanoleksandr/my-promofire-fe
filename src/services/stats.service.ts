import { apiClient } from '../lib/api-client';
import type {
  StatsOverview,
  StatsRangeParams,
  CodesStatsResponse,
  UsersStatsResponse,
  BreakdownResponse,
} from '../types/stats';

export const statsService = {
  // Форма ответа зависит от роли текущего пользователя — см. discriminant union StatsOverview
  async getOverview(): Promise<StatsOverview> {
    const { data } = await apiClient.get<StatsOverview>('/stats/overview');
    return data;
  },

  // Графики Generated/Redeemed/Expired + итоги с % изменения к предыдущему периоду
  async getCodesStats(params: StatsRangeParams = {}): Promise<CodesStatsResponse> {
    const { data } = await apiClient.get<CodesStatsResponse>('/stats/codes', { params });
    return data;
  },

  // Графики Active/New + итог All users (не входит в линии графика, только KPI-число)
  async getUsersStats(params: StatsRangeParams = {}): Promise<UsersStatsResponse> {
    const { data } = await apiClient.get<UsersStatsResponse>('/stats/users', { params });
    return data;
  },

  // Донат-чарт по странам — данные только по тем Redemption, где SDK передал country
  async getCountriesBreakdown(params: StatsRangeParams = {}): Promise<BreakdownResponse> {
    const { data } = await apiClient.get<BreakdownResponse>('/stats/countries', { params });
    return data;
  },

  // Донат-чарт по устройствам (ios/android/web) — аналогично, зависит от SDK
  async getDevicesBreakdown(params: StatsRangeParams = {}): Promise<BreakdownResponse> {
    const { data } = await apiClient.get<BreakdownResponse>('/stats/devices', { params });
    return data;
  },
};
