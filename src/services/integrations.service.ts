import { apiClient } from '../lib/api-client';
import type {
  Integration,
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

  async findMine(params: DateRangeParams = {}): Promise<Integration[]> {
    const { data } = await apiClient.get<Integration[]>('/integrations', { params });
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/integrations/${id}`);
  },
};
