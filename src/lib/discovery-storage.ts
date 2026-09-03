// Флаг "онбординг уже показан/пройден" — per-аккаунт, чтобы у разных
// пользователей на одном браузере (или после logout/login другим аккаунтом)
// тур снова предлагался
const KEY_PREFIX = 'promofire_discovery_seen_';

export function isDiscoverySeen(accountId: string): boolean {
  return localStorage.getItem(KEY_PREFIX + accountId) === '1';
}

export function markDiscoverySeen(accountId: string): void {
  localStorage.setItem(KEY_PREFIX + accountId, '1');
}
