export interface Integration {
  id: string;
  name: string;
  workspaceId: string;
  distributorMembershipId: string;
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

// То, что реально отдаёт GET /integrations — Integration + агрегаты,
// посчитанные на бэке одним набором запросов (не N+1 на каждую строку)
export interface IntegrationListItem extends Integration {
  // Все обращения к SDK через эту интеграцию (validate + redeem)
  actions: number;
  // Коды, сгенерированные этой интеграцией самостоятельно (self-serve,
  // POST /sdk/codes/generate) — не коды, выданные ей вручную Distributor'ом
  generated: number;
}
