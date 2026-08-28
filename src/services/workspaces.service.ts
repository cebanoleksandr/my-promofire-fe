import { apiClient } from '../lib/api-client';
import { setAccessToken, setAccount, setWorkspace } from '../lib/auth-storage';
import type { WorkspaceAuthResponse } from '../types/auth';
import type { WorkspaceListItem, CreateWorkspaceDto } from '../types/workspace';

export const workspacesService = {
  // "Кнопка New Workspace" — создаёт воркспейс и сразу переключает токен на него,
  // так что после вызова можно сразу работать в новом воркспейсе
  async create(dto: CreateWorkspaceDto): Promise<WorkspaceAuthResponse> {
    const { data } = await apiClient.post<WorkspaceAuthResponse>('/workspaces', dto);
    setAccessToken(data.accessToken);
    setAccount(data.account);
    setWorkspace(data.workspace);
    return data;
  },

  // Список для UI-свитчера воркспейсов
  async findMine(): Promise<WorkspaceListItem[]> {
    const { data } = await apiClient.get<WorkspaceListItem[]>('/workspaces/mine');
    return data;
  },
};
