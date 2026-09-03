import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { customersService } from '../../services';
import { EQueries, queryKeys } from '../_types';
import queryClient from '../queryClient';
import type { ApiError } from '../../types/api-error';
import type {
  CustomerDetail,
  CustomerListItem,
  CustomerRangeParams,
  UpdateCustomerDto,
} from '../../types/customer';
import type { PromoCodeListItem } from '../../types/promo-code';
import type { BreakdownResponse } from '../../types/stats';
import type { PaginatedResult, PaginationParams } from '../../types/pagination';

// Список клиентов воркспейса (скоуп по роли решает бэкенд)
export function useCustomers(params: PaginationParams = {}) {
  return useQuery<PaginatedResult<CustomerListItem>, ApiError>({
    queryKey: queryKeys.customers(params),
    queryFn: () => customersService.findAll(params),
    placeholderData: keepPreviousData,
  });
}

// Шапка + тайлы клиента (Actions / Redeemed / Codes used)
export function useCustomer(id: string | undefined, params: CustomerRangeParams = {}) {
  return useQuery<CustomerDetail, ApiError>({
    queryKey: queryKeys.customer(id ?? '', params),
    queryFn: () => customersService.findOne(id as string, params),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

export function useCustomerDevicesBreakdown(
  id: string | undefined,
  params: CustomerRangeParams = {},
) {
  return useQuery<BreakdownResponse, ApiError>({
    queryKey: queryKeys.customerDevices(id ?? '', params),
    queryFn: () => customersService.getDevicesBreakdown(id as string, params),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

export function useCustomerCountriesBreakdown(
  id: string | undefined,
  params: CustomerRangeParams = {},
) {
  return useQuery<BreakdownResponse, ApiError>({
    queryKey: queryKeys.customerCountries(id ?? '', params),
    queryFn: () => customersService.getCountriesBreakdown(id as string, params),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

// Таблица кодов клиента: Name / Status / Actions / New users / Lifetime
export function useCustomerCodes(
  id: string | undefined,
  params: PaginationParams & CustomerRangeParams = {},
) {
  return useQuery<PaginatedResult<PromoCodeListItem>, ApiError>({
    queryKey: queryKeys.customerCodes(id ?? '', params),
    queryFn: () => customersService.findCodes(id as string, params),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

// Блок "Descriptions" — внутренняя заметка о клиенте
export function useUpdateCustomer() {
  return useMutation<
    CustomerDetail,
    ApiError,
    { id: string; dto: UpdateCustomerDto }
  >({
    mutationFn: ({ id, dto }) => customersService.update(id, dto),
    onSuccess: (customer) => {
      // findOne() ключуется вместе с CustomerRangeParams — точечно not угадать,
      // поэтому мёржим по всем закэшированным вариантам через predicate-инвалидацию
      queryClient.invalidateQueries({
        queryKey: [EQueries.CUSTOMER, customer.id],
      });
      queryClient.invalidateQueries({ queryKey: [EQueries.CUSTOMERS] });
    },
  });
}
