import { useQuery } from '@tanstack/react-query';
import { statsService } from '../../services';
import { queryKeys } from '../_types';
import type { ApiError } from '../../types/api-error';
import type { StatsOverview } from '../../types/stats';

// Форма ответа зависит от роли — сужать по полю scope (discriminant union)
export function useStatsOverview() {
  return useQuery<StatsOverview, ApiError>({
    queryKey: queryKeys.statsOverview(),
    queryFn: () => statsService.getOverview(),
  });
}
