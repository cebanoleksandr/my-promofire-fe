import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useCustomers } from '../network/hooks';
import { DateLabel, Pagination, Table, type TableSort } from '../components/ui';
import { colors } from '../theme';
import type { CustomerListItem } from '../types/customer';

const PAGE_SIZE = 20;

const UsersPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TableSort | null>(null);

  const { data, isPending } = useCustomers({ page, limit: PAGE_SIZE });

  const rows = useMemo(() => {
    const list = data?.data ?? [];
    if (!sort) return list;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.columnId) {
        case 'name':
          return (a.name ?? a.externalCustomerId).localeCompare(
            b.name ?? b.externalCustomerId,
          ) * dir;
        case 'email':
          return (a.email ?? '').localeCompare(b.email ?? '') * dir;
        case 'firstSeenAt':
          return (
            (new Date(a.firstSeenAt).getTime() - new Date(b.firstSeenAt).getTime()) * dir
          );
        default: {
          return (
            (new Date(a.lastSeenAt).getTime() - new Date(b.lastSeenAt).getTime()) * dir
          );
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
        Users
      </Typography>

      <Table<CustomerListItem>
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
                {r.name || r.externalCustomerId}
              </Typography>
            ),
          },
          {
            id: 'email',
            header: 'Email',
            sortable: true,
            cell: (r) => r.email ?? '—',
          },
          {
            id: 'firstSeenAt',
            header: 'Joined',
            align: 'right',
            sortable: true,
            cell: (r) => <DateLabel from={r.firstSeenAt} withIcon={false} />,
          },
          {
            id: 'lastSeenAt',
            header: 'Last session',
            align: 'right',
            sortable: true,
            cell: (r) => <DateLabel from={r.lastSeenAt} withIcon={false} />,
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

export default UsersPage;
