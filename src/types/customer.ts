import type { StatsPeriod } from './stats';

// "Users" в UI = конечные клиенты интеграторов (externalCustomerId), не Account.
// Идентифицируется парой (workspace, externalCustomerId), создаётся/обновляется
// автоматически на каждом обращении к коду (validate/redeem)
export interface Customer {
  id: string;
  workspaceId: string;
  externalCustomerId: string;
  // Контактные поля — приходят из SDK, если интегратор их передал
  name: string | null;
  email: string | null;
  phone: string | null;
  // Внутренняя заметка Owner'а/Admin'а (блок "Descriptions"), не приходит из SDK
  description: string | null;
  // "Joined" в UI — момент самого первого обращения этого клиента
  firstSeenAt: string;
  // "Last session" в UI — момент последнего обращения
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerListItem = Customer;

// Период для тайлов/доунатов на странице клиента, по умолчанию — месяц
export interface CustomerRangeParams {
  period?: StatsPeriod;
  from?: string;
  to?: string;
}

// GET /users/:id — шапка + тайлы (Actions / Redeemed / Codes used) с % к прошлому периоду
export interface CustomerDetail extends Customer {
  totals: {
    actions: number;
    actionsChangePct: number;
    redeemed: number;
    redeemedChangePct: number;
    codesUsed: number;
    codesUsedChangePct: number;
  };
}

export interface UpdateCustomerDto {
  description?: string;
}
