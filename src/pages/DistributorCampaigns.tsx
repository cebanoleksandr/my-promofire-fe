import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { StatsPeriod, type DateRangeParams } from '../types';
import { useDistributor, useDistributorsBreakdown } from '../network/hooks';
import {
  Button,
  PeriodControl,
  Table,
  type TableSort,
} from '../components/ui';
import { colors } from '../theme';
import type { DistributorCampaignBreakdown } from '../types/stats';

const numberFmt = new Intl.NumberFormat('en-US');

type NumericCampaignKey = 'generated' | 'redeemed' | 'actions' | 'newUsers';

const CAMPAIGN_COLUMNS: { id: NumericCampaignKey; header: string; help?: string }[] = [
  { id: 'generated', header: 'Generated', help: 'Promo codes generated' },
  { id: 'redeemed', header: 'Redeemed', help: 'Successfully redeemed codes' },
  {
    id: 'actions',
    header: 'Actions',
    help: 'All code lookups (validate + redeem), not only successful redemptions',
  },
  {
    id: 'newUsers',
    header: 'New Users',
    help: 'Customers whose first-ever activity in the workspace was a code from this campaign',
  },
];

const DistributorCampaigns = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [period, setPeriod] = useState<DateRangeParams>({
    period: StatsPeriod.MONTH,
  });
  const [sort, setSort] = useState<TableSort | null>(null);

  const distributor = useDistributor(id);
  const breakdown = useDistributorsBreakdown(period);

  const campaigns = useMemo(
    () => breakdown.data?.find((b) => b.membershipId === id)?.campaigns ?? [],
    [breakdown.data, id],
  );

  const rows = useMemo(() => {
    if (!sort) return campaigns;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...campaigns].sort((a, b) => {
      if (sort.columnId === 'name') return a.name.localeCompare(b.name) * dir;
      const key = sort.columnId as NumericCampaignKey;
      return (a[key] - b[key]) * dir;
    });
  }, [campaigns, sort]);

  const d = distributor.data;

  if (distributor.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!d) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', py: 6 }}>
        <Typography>Distributor not found.</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/distributors')}>
          Back to distributors
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Хлебные крошки */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate('/distributors')}
        >
          Distributors
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate(`/distributors/${d.id}`)}
        >
          {d.displayName}
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          Campaigns
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <PeriodControl
          value={period}
          onChange={setPeriod}
          onRefresh={() => breakdown.refetch()}
        />
      </Box>

      <Table<DistributorCampaignBreakdown>
        rows={rows}
        getRowKey={(r) => r.campaignId}
        loading={breakdown.isPending}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(r) => navigate(`/campaigns/${r.campaignId}`)}
        emptyContent="Not assigned to any campaign yet"
        columns={[
          {
            id: 'name',
            header: 'Name',
            sortable: true,
            cell: (r) => r.name,
          },
          ...CAMPAIGN_COLUMNS.map((c) => ({
            id: c.id,
            header: c.header,
            sortable: true,
            help: c.help,
            align: 'right' as const,
            cell: (r: DistributorCampaignBreakdown) => numberFmt.format(r[c.id]),
          })),
        ]}
      />
    </Box>
  );
};

export default DistributorCampaigns;
