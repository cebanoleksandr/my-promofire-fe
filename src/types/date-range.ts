import type { StatsPeriod } from './stats';

// Используется в листингах (promo-codes/integrations/memberships), а не только в stats.
// В отличие от StatsRangeParams — если period не передан, бэкенд не фильтрует вообще
// (показывает все записи), а не подставляет дефолтный период.
export interface DateRangeParams {
  period?: StatsPeriod;
  from?: string; // YYYY-MM-DD, обязателен только при period === 'custom'
  to?: string;
}
