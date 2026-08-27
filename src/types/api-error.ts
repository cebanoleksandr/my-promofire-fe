export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

// Оборачиваем ошибку API в обычный Error, чтобы удобно ловить в try/catch
// и показывать message напрямую в UI (toast, форма и т.п.)
export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorType: string;
  readonly path: string;

  constructor(response: ApiErrorResponse) {
    const message = Array.isArray(response.message)
      ? response.message.join(', ')
      : response.message;

    super(message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.errorType = response.error;
    this.path = response.path;
  }
}
