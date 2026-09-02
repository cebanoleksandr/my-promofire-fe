import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useCampaigns } from '../network/hooks';
import { Button, Pagination, Table, type TableSort } from '../components/ui';
import { colors } from '../theme';
import {
  CampaignStatusFilter,
  type CampaignListItem,
} from '../types/campaign';

const TABS: { value: CampaignStatusFilter; label: string }[] = [
  { value: CampaignStatusFilter.ACTIVE, label: 'Active' },
  { value: CampaignStatusFilter.ARCHIVED, label: 'Archived' },
  { value: CampaignStatusFilter.DEACTIVATED, label: 'Deactivated' },
];

const PAGE_SIZE = 20;

const numberFmt = new Intl.NumberFormat('en-US');

function distributorNames(row: CampaignListItem): string {
  if (!row.distributors.length) return '—';
  return row.distributors.map((d) => d.name).join(', ');
}

const CampaignsPage = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<CampaignStatusFilter>(
    CampaignStatusFilter.ACTIVE,
  );
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TableSort | null>(null);

  const { data, isPending } = useCampaigns({ status, page, limit: PAGE_SIZE });

  const rows = useMemo(() => {
    const list = data?.data ?? [];
    if (!sort) return list;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.columnId === 'name') return a.name.localeCompare(b.name) * dir;
      const key = sort.columnId as 'generated' | 'redeemed' | 'actions' | 'newUsers';
      return (a[key] - b[key]) * dir;
    });
  }, [data?.data, sort]);

  const totalPages = data?.meta.totalPages ?? 1;

  const changeStatus = (next: CampaignStatusFilter) => {
    setStatus(next);
    setPage(1);
    setSort(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px' }}>
          Campaigns
        </Typography>
        <Button onClick={() => navigate('/campaigns/create')}>Create campaign</Button>
      </Box>

      <Tabs
        value={status}
        onChange={(_, v) => changeStatus(v as CampaignStatusFilter)}
        sx={{
          mb: 3,
          minHeight: 44,
          borderBottom: `1px solid ${colors.interface.grey3}`,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            minHeight: 44,
            px: 0,
            mr: 3,
            color: colors.interface.grey,
          },
          '& .Mui-selected': { color: `${colors.interface.black} !important` },
          '& .MuiTabs-indicator': { backgroundColor: colors.interface.black },
        }}
      >
        {TABS.map((t) => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </Tabs>

      <Table<CampaignListItem>
        rows={rows}
        getRowKey={(r) => r.id}
        loading={isPending}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(r) => navigate(`/campaigns/${r.id}`)}
        emptyContent="No campaigns here yet"
        columns={[
          {
            id: 'name',
            header: 'Name',
            sortable: true,
            cell: (r) => (
              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: colors.interface.black,
                  }}
                >
                  {r.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: colors.interface.grey }}>
                  Distributor:{' '}
                  <Box
                    component="span"
                    sx={{ color: colors.brand.main, fontWeight: 500 }}
                  >
                    {distributorNames(r)}
                  </Box>
                </Typography>
              </Box>
            ),
          },
          {
            id: 'generated',
            header: 'Generated',
            align: 'right',
            sortable: true,
            help: 'Promo codes generated for this campaign',
            cell: (r) => numberFmt.format(r.generated),
          },
          {
            id: 'redeemed',
            header: 'Redeemed',
            align: 'right',
            sortable: true,
            help: 'Successfully redeemed codes',
            cell: (r) => numberFmt.format(r.redeemed),
          },
          {
            id: 'actions',
            header: 'Actions',
            align: 'right',
            sortable: true,
            help: 'All code lookups (validate + redeem), not only successful redemptions',
            cell: (r) => numberFmt.format(r.actions),
          },
          {
            id: 'newUsers',
            header: 'New Users',
            align: 'right',
            sortable: true,
            help: 'Customers whose first-ever activity in the workspace was a code from this campaign',
            cell: (r) => numberFmt.format(r.newUsers),
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

export default CampaignsPage;
