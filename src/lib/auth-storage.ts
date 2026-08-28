import type { AccountInfo, WorkspaceContext } from '../types/auth';

const ACCESS_TOKEN_KEY = 'promofire_access_token';
const ACCOUNT_KEY = 'promofire_account';
const WORKSPACE_KEY = 'promofire_workspace';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function setAccount(account: AccountInfo): void {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

export function getStoredAccount(): AccountInfo | null {
  const raw = localStorage.getItem(ACCOUNT_KEY);
  return raw ? (JSON.parse(raw) as AccountInfo) : null;
}

export function setWorkspace(workspace: WorkspaceContext): void {
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
}

// null означает "воркспейс ещё не выбран" — например, сразу после логина
// в мультиворкспейс-аккаунт, до вызова select-workspace
export function getStoredWorkspace(): WorkspaceContext | null {
  const raw = localStorage.getItem(WORKSPACE_KEY);
  return raw ? (JSON.parse(raw) as WorkspaceContext) : null;
}

export function clearWorkspace(): void {
  localStorage.removeItem(WORKSPACE_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCOUNT_KEY);
  localStorage.removeItem(WORKSPACE_KEY);
}
