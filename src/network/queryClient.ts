import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../types/api-error';

// Не ретраим то, что ретраить бессмысленно: клиентские ошибки (4xx),
// включая 401 — на нём api-client уже кидает на /login
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    if (error.statusCode >= 400 && error.statusCode < 500) return false;
  }
  return failureCount < 2;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      // Данные считаются свежими 30с — за это время дубли-запросы дедупятся
      staleTime: 30_000,
      // Неиспользуемый кеш живёт 5 минут перед сборкой мусора
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
