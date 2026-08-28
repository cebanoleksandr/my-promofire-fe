import type { Role } from './membership';

// Элемент списка "мои воркспейсы" — для свитчера в UI
export interface WorkspaceListItem {
  membershipId: string;
  workspaceId: string;
  workspaceName: string;
  role: Role;
}

export interface CreateWorkspaceDto {
  name: string;
}
