import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { StatsPeriod, type DateRangeParams } from '../types';
import { useIntegrations } from '../network/hooks';
import { PeriodControl, Table, type TableSort } from '../components/ui';
import { colors } from '../theme';
import type { IntegrationListItem } from '../types/integration';

const numberFmt = new Intl.NumberFormat('en-US');

const UsersPage = () => {
  const navigate = useNavigate();

  const [period, setPeriod] = useState<DateRangeParams>({
    period: StatsPeriod.MONTH,
  });
  const [sort, setSort] = useState<TableSort | null>(null);

  const { data, isPending, refetch } = useIntegrations(period);

  const rows = useMemo(() => {
    const list = data ?? [];
    if (!sort) return list;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.columnId === 'name') return a.name.localeCompare(b.name) * dir;
      const key = sort.columnId as 'actions' | 'generated';
      return (a[key] - b[key]) * dir;
    });
  }, [data, sort]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography
        sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px', mb: 3 }}
      >
        Users
      </Typography>

      <Box sx={{ mb: 3 }}>
        <PeriodControl
          value={period}
          onChange={setPeriod}
          onRefresh={() => refetch()}
        />
      </Box>

      <Table<IntegrationListItem>
        rows={rows}
        getRowKey={(r) => r.id}
        loading={isPending}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(r) => navigate(`/users/${r.id}`)}
        emptyContent="No users here yet"
        columns={[
          {
            id: 'name',
            header: 'Name',
            sortable: true,
            cell: (r) => (
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: colors.interface.black,
                }}
              >
                {r.name}
              </Typography>
            ),
          },
          {
            id: 'actions',
            header: 'Actions',
            align: 'right',
            sortable: true,
            help: 'All SDK calls through this integration (validate + redeem)',
            cell: (r) => numberFmt.format(r.actions),
          },
          {
            id: 'generated',
            header: 'Generated',
            align: 'right',
            sortable: true,
            help: 'Codes this integration generated itself (self-serve), not codes handed to it manually',
            cell: (r) => numberFmt.format(r.generated),
          },
        ]}
      />
    </Box>
  );
};

export default UsersPage;
