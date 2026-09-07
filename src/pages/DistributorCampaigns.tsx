import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const DistributorCampaigns = () => {
  const { t } = useTranslation('distributors');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const CAMPAIGN_COLUMNS: { id: NumericCampaignKey; header: string; help?: string }[] = [
    { id: 'generated', header: t('columns.generated'), help: t('help.generated') },
    { id: 'redeemed', header: t('columns.redeemed'), help: t('help.redeemed') },
    {
      id: 'actions',
      header: t('columns.actions'),
      help: t('help.actions'),
    },
    {
      id: 'newUsers',
      header: t('columns.newUsers'),
      help: t('help.newUsersCampaign'),
    },
  ];

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
        <Typography>{t('notFound')}</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/distributors')}>
          {t('actions.backToDistributors')}
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
          {t('breadcrumbs.distributors')}
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
          {t('breadcrumbs.campaigns')}
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
        emptyContent={t('empty.notAssignedToCampaign')}
        columns={[
          {
            id: 'name',
            header: t('columns.name'),
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
