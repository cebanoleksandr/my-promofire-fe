import { useMutation, useQuery } from '@tanstack/react-query';
import { workspacesService } from '../../services';
import { queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type { WorkspaceAuthResponse } from '../../types/auth';
import type { WorkspaceListItem, CreateWorkspaceDto } from '../../types/workspace';

/** Список воркспейсов аккаунта — для UI-свитчера. */
export function useMyWorkspaces() {
  return useQuery<WorkspaceListItem[], ApiError>({
    queryKey: queryKeys.workspacesMine(),
    queryFn: () => workspacesService.findMine(),
  });
}

// Создаёт воркспейс и сразу переключает на него токен
export function useCreateWorkspace() {
  return useMutation<WorkspaceAuthResponse, ApiError, CreateWorkspaceDto>({
    mutationFn: (dto) => workspacesService.create(dto),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKeys.currentAccount(), res.account);
      queryClient.setQueryData(queryKeys.currentWorkspace(), res.workspace);
      queryClient.invalidateQueries({ queryKey: queryKeys.workspacesMine() });
      queryClient.invalidateQueries();
    },
  });
}
