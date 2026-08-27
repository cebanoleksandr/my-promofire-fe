import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { integrationsService } from '../../services';
import { queryKeys } from '../_types';
import type { ApiError } from '../../types/api-error';
import type {
  CreateIntegrationDto,
  CreateIntegrationResponse,
  Integration,
} from '../../types/integration';

export function useIntegrations() {
  return useQuery<Integration[], ApiError>({
    queryKey: queryKeys.integrations(),
    queryFn: () => integrationsService.findMine(),
  });
}

// В ответе приходит полный apiKey — показать пользователю один раз, второй раз не отдаётся
export function useCreateIntegration() {
  const qc = useQueryClient();

  return useMutation<CreateIntegrationResponse, ApiError, CreateIntegrationDto>({
    mutationFn: (dto) => integrationsService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.integrations() });
    },
  });
}

export function useDeleteIntegration() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (id) => integrationsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.integrations() });
    },
  });
}
