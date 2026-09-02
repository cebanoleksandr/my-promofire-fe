import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { statsService } from '../../services';
import { queryKeys } from '../_types';
import type { ApiError } from '../../types/api-error';
import type {
  StatsOverview,
  StatsRangeParams,
  CodesStatsResponse,
  UsersStatsResponse,
  BreakdownResponse,
  DistributorBreakdown,
} from '../../types/stats';

// Форма ответа зависит от роли — сужать по полю scope (discriminant union)
export function useStatsOverview() {
  return useQuery<StatsOverview, ApiError>({
    queryKey: queryKeys.statsOverview(),
    queryFn: () => statsService.getOverview(),
  });
}

// Графики Generated/Redeemed/Expired + итоги с % изменения к прошлому периоду
export function useCodesStats(params: StatsRangeParams = {}) {
  return useQuery<CodesStatsResponse, ApiError>({
    queryKey: queryKeys.statsCodes(params),
    queryFn: () => statsService.getCodesStats(params),
    placeholderData: keepPreviousData,
  });
}

// Графики Active/New + KPI All users
export function useUsersStats(params: StatsRangeParams = {}) {
  return useQuery<UsersStatsResponse, ApiError>({
    queryKey: queryKeys.statsUsers(params),
    queryFn: () => statsService.getUsersStats(params),
    placeholderData: keepPreviousData,
  });
}

// Донат по странам
export function useCountriesBreakdown(params: StatsRangeParams = {}) {
  return useQuery<BreakdownResponse, ApiError>({
    queryKey: queryKeys.statsCountries(params),
    queryFn: () => statsService.getCountriesBreakdown(params),
    placeholderData: keepPreviousData,
  });
}

// Донат по устройствам (ios/android/web)
export function useDevicesBreakdown(params: StatsRangeParams = {}) {
  return useQuery<BreakdownResponse, ApiError>({
    queryKey: queryKeys.statsDevices(params),
    queryFn: () => statsService.getDevicesBreakdown(params),
    placeholderData: keepPreviousData,
  });
}

// Разбивка по Distributor'ам и их кампаниям. 403 для роли Distributor —
// вызывать только для Owner/Admin
export function useDistributorsBreakdown(params: StatsRangeParams = {}) {
  return useQuery<DistributorBreakdown[], ApiError>({
    queryKey: queryKeys.statsDistributors(params),
    queryFn: () => statsService.getDistributorsBreakdown(params),
    placeholderData: keepPreviousData,
  });
}
