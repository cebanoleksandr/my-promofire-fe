import { apiClient } from '../lib/api-client';
import type {
  CustomerListItem,
  CustomerDetail,
  CustomerRangeParams,
  UpdateCustomerDto,
} from '../types/customer';
import type { PromoCodeListItem } from '../types/promo-code';
import type { BreakdownResponse } from '../types/stats';
import type { PaginatedResult, PaginationParams } from '../types/pagination';

export const customersService = {
  // Owner видит всех клиентов воркспейса, Admin/Distributor — только тех, кто
  // взаимодействовал с кодами в их зоне видимости
  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<CustomerListItem>> {
    const { data } = await apiClient.get<PaginatedResult<CustomerListItem>>('/users', {
      params,
    });
    return data;
  },

  // Шапка + тайлы (Actions / Redeemed / Codes used) с % к прошлому периоду
  async findOne(id: string, params: CustomerRangeParams = {}): Promise<CustomerDetail> {
    const { data } = await apiClient.get<CustomerDetail>(`/users/${id}`, { params });
    return data;
  },

  async getDevicesBreakdown(
    id: string,
    params: CustomerRangeParams = {},
  ): Promise<BreakdownResponse> {
    const { data } = await apiClient.get<BreakdownResponse>(`/users/${id}/devices`, {
      params,
    });
    return data;
  },

  async getCountriesBreakdown(
    id: string,
    params: CustomerRangeParams = {},
  ): Promise<BreakdownResponse> {
    const { data } = await apiClient.get<BreakdownResponse>(`/users/${id}/countries`, {
      params,
    });
    return data;
  },

  // Таблица кодов клиента: Name / Status / Actions / New users / Lifetime
  async findCodes(
    id: string,
    params: PaginationParams & CustomerRangeParams = {},
  ): Promise<PaginatedResult<PromoCodeListItem>> {
    const { data } = await apiClient.get<PaginatedResult<PromoCodeListItem>>(
      `/users/${id}/codes`,
      { params },
    );
    return data;
  },

  // Блок "Descriptions" — внутренняя заметка о клиенте
  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerDetail> {
    const { data } = await apiClient.patch<CustomerDetail>(`/users/${id}`, dto);
    return data;
  },
};
