export interface Integration {
  id: string;
  name: string;
  distributorId: string;
  apiKeyPrefix: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationDto {
  name: string;
}

// Единственный ответ, где бэкенд отдаёт полный API-ключ — второй раз его не достать
export interface CreateIntegrationResponse {
  integration: Integration;
  apiKey: string;
}
