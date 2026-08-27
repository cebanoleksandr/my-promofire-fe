import { useMutation, useQuery } from '@tanstack/react-query';
import { integrationsService } from '../../services';
import { queryKeys } from '../_types';
import queryClient from '../queryClient';
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
  return useMutation<CreateIntegrationResponse, ApiError, CreateIntegrationDto>({
    mutationFn: (dto) => integrationsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations() });
    },
  });
}

export function useDeleteIntegration() {
  return useMutation<void, ApiError, string>({
    mutationFn: (id) => integrationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations() });
    },
  });
}
