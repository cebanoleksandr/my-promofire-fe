import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { ApiError, type ApiErrorResponse } from '../types/api-error';
import { getAccessToken, clearAuth } from './auth-storage';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

// Подставляем JWT в каждый запрос, если пользователь залогинен
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Токен невалиден/истёк, или пользователя деактивировали — выкидываем на логин
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }

    // WorkspaceGuard возвращает 403 "Сначала выберите воркспейс", если токен
    // ещё не привязан к конкретному воркспейсу — распознаётся по error.message
    // на уровне UI (например, редирект на экран выбора воркспейса)

    // Приводим ошибку к нашему формату (единый message/statusCode из HttpExceptionFilter)
    if (error.response?.data) {
      return Promise.reject(new ApiError(error.response.data));
    }

    return Promise.reject(error);
  },
);
