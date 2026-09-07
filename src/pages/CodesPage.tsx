import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { StatsPeriod, type DateRangeParams } from '../types';
import { usePromoCodes } from '../network/hooks';
import {
  DateLabel,
  Pagination,
  PromoCodeDisplayStatusChip,
  PeriodControl,
  Table,
  type TableSort,
} from '../components/ui';
import { colors } from '../theme';
import type { PromoCodeListItem } from '../types/promo-code';

const PAGE_SIZE = 20;
const numberFmt = new Intl.NumberFormat('en-US');

const CodesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('codes');

  const [period, setPeriod] = useState<DateRangeParams>({
    period: StatsPeriod.MONTH,
  });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TableSort | null>(null);

  const { data, isPending, refetch } = usePromoCodes({
    ...period,
    page,
    limit: PAGE_SIZE,
  });

  const changePeriod = (next: DateRangeParams) => {
    setPeriod(next);
    setPage(1);
  };

  const rows = useMemo(() => {
    const list = data?.data ?? [];
    if (!sort) return list;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.columnId) {
        case 'code':
          return a.code.localeCompare(b.code) * dir;
        case 'status':
          return a.displayStatus.localeCompare(b.displayStatus) * dir;
        case 'lifetime':
          return (
            (new Date(a.lifetime ?? 0).getTime() -
              new Date(b.lifetime ?? 0).getTime()) *
            dir
          );
        default: {
          const key = sort.columnId as 'actions' | 'newUsers';
          return (a[key] - b[key]) * dir;
        }
      }
    });
  }, [data?.data, sort]);

  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography
        sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px', mb: 3 }}
      >
        {t('page.title')}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <PeriodControl
          value={period}
          onChange={changePeriod}
          onRefresh={() => refetch()}
        />
      </Box>

      <Table<PromoCodeListItem>
        rows={rows}
        getRowKey={(r) => r.id}
        loading={isPending}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(r) => navigate(`/codes/${r.id}`)}
        emptyContent={t('page.emptyCodes')}
        columns={[
          {
            id: 'code',
            header: t('page.columns.name'),
            sortable: true,
            cell: (r) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContentCopyRoundedIcon
                  sx={{ fontSize: 16, color: colors.interface.grey }}
                />
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: colors.interface.black,
                  }}
                >
                  {r.code}
                </Typography>
              </Box>
            ),
          },
          {
            id: 'status',
            header: t('page.columns.status'),
            sortable: true,
            cell: (r) => <PromoCodeDisplayStatusChip status={r.displayStatus} />,
          },
          {
            id: 'actions',
            header: t('page.columns.actions'),
            align: 'right',
            sortable: true,
            help: t('page.help.actions'),
            cell: (r) => numberFmt.format(r.actions),
          },
          {
            id: 'newUsers',
            header: t('page.columns.newUsers'),
            align: 'right',
            sortable: true,
            help: t('page.help.newUsers'),
            cell: (r) => numberFmt.format(r.newUsers),
          },
          {
            id: 'lifetime',
            header: t('page.columns.lifetime'),
            align: 'right',
            sortable: true,
            help: t('page.help.lifetime'),
            cell: (r) =>
              r.lifetime ? (
                <DateLabel from={r.lifetime} withIcon={false} />
              ) : (
                '∞'
              ),
          },
        ]}
      />

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={setPage} />
        </Box>
      )}
    </Box>
  );
};

export default CodesPage;
