import { apiClient } from '../lib/api-client';
import type {
  IntegrationListItem,
  CreateIntegrationDto,
  CreateIntegrationResponse,
} from '../types/integration';
import type { DateRangeParams } from '../types/date-range';

export const integrationsService = {
  // apiKey в ответе отдаётся ровно один раз — сразу покажи его пользователю
  // с предупреждением "сохраните сейчас, второй раз не покажем"
  async create(dto: CreateIntegrationDto): Promise<CreateIntegrationResponse> {
    const { data } = await apiClient.post<CreateIntegrationResponse>(
      '/integrations',
      dto,
    );
    return data;
  },

  // Каждая строка уже содержит actions/generated — считать самому на фронте не нужно
  async findMine(params: DateRangeParams = {}): Promise<IntegrationListItem[]> {
    const { data } = await apiClient.get<IntegrationListItem[]>('/integrations', { params });
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/integrations/${id}`);
  },
};
