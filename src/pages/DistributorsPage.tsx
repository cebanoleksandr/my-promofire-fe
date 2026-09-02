import { useMemo, useState } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useDispatch } from 'react-redux';
import { StatsPeriod, type DateRangeParams } from '../types';
import {
  useCodesStats,
  useDistributorsBreakdown,
  useMyTeam,
  useResendInvite,
  useUsersStats,
} from '../network/hooks';
import {
  Button,
  MemberStatusChip,
  PeriodControl,
  Table,
  TableCard,
  type TableSort,
} from '../components/ui';
import { StatTile } from '../components/dashboard';
import { setAlertAC } from '../store/alertSlice';
import { MembershipStatus } from '../types/membership';
import { colors, customShadows } from '../theme';
import type {
  DistributorBreakdown,
  DistributorCampaignBreakdown,
} from '../types/stats';

const numberFmt = new Intl.NumberFormat('en-US');

type NumericCampaignKey = 'generated' | 'redeemed' | 'actions' | 'newUsers';

const CAMPAIGN_COLUMNS: {
  id: NumericCampaignKey;
  header: string;
  help?: string;
}[] = [
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

function DistributorCard({
  item,
  status,
}: {
  item: DistributorBreakdown;
  status: MembershipStatus | undefined;
}) {
  const dispatch = useDispatch();
  const [sort, setSort] = useState<TableSort | null>(null);
  const resend = useResendInvite();

  const isPending = status === MembershipStatus.PENDING;

  const handleResend = () => {
    resend.mutate(item.membershipId, {
      onSuccess: () =>
        dispatch(
          setAlertAC({ text: `Invitation re-sent to ${item.email}`, mode: 'success' }),
        ),
      onError: (e) =>
        dispatch(setAlertAC({ text: e.message, mode: 'error' })),
    });
  };

  const rows = useMemo(() => {
    const list = item.campaigns;
    if (!sort) return list;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.columnId === 'name') return a.name.localeCompare(b.name) * dir;
      const key = sort.columnId as keyof DistributorCampaignBreakdown;
      return ((a[key] as number) - (b[key] as number)) * dir;
    });
  }, [item.campaigns, sort]);

  return (
    <TableCard
      title={item.displayName}
      meta={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MemberStatusChip
            status={status ?? MembershipStatus.ACTIVE}
            isActive={item.isActive}
          />
          {isPending && (
            <Button
              size="XS"
              variant="white"
              startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
              loading={resend.isPending}
              onClick={handleResend}
            >
              Resend invitation
            </Button>
          )}
        </Box>
      }
      actions={
        <IconButton size="small" aria-label="Distributor actions">
          <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      }
    >
      <Table<DistributorCampaignBreakdown>
        bare
        rows={rows}
        getRowKey={(r) => r.campaignId}
        sort={sort}
        onSortChange={setSort}
        emptyContent="Nothing yet"
        columns={[
          {
            id: 'name',
            header: 'Campaign',
            sortable: true,
            cell: (r) => r.name,
          },
          ...CAMPAIGN_COLUMNS.map((c) => ({
            id: c.id,
            header: c.header,
            sortable: true,
            help: c.help,
            cell: (r: DistributorCampaignBreakdown) => numberFmt.format(r[c.id]),
          })),
        ]}
      />
    </TableCard>
  );
}

const DistributorsPage = () => {
  const [period, setPeriod] = useState<DateRangeParams>({
    period: StatsPeriod.MONTH,
  });

  const codesStats = useCodesStats(period);
  const usersStats = useUsersStats(period);
  const distributors = useDistributorsBreakdown(period);
  const team = useMyTeam({ limit: 100 });

  const statusByMembership = useMemo(() => {
    const map = new Map<string, MembershipStatus>();
    for (const m of team.data?.data ?? []) map.set(m.id, m.status);
    return map;
  }, [team.data?.data]);

  const refetchAll = () => {
    codesStats.refetch();
    usersStats.refetch();
    distributors.refetch();
    team.refetch();
  };

  const ct = codesStats.data?.totals;
  const ut = usersStats.data?.totals;

  const summary = [
    {
      label: 'Actions',
      value: ct?.actions ?? 0,
      changePct: ct?.actionsChangePct,
      help: 'All code lookups (validate + redeem), not only successful redemptions',
      loading: codesStats.isPending,
    },
    {
      label: 'Generated',
      value: ct?.generated ?? 0,
      changePct: ct?.generatedChangePct,
      loading: codesStats.isPending,
    },
    {
      label: 'Redeemed',
      value: ct?.redeemed ?? 0,
      changePct: ct?.redeemedChangePct,
      loading: codesStats.isPending,
    },
    {
      label: 'Expired',
      value: ct?.expired ?? 0,
      changePct: ct?.expiredChangePct,
      loading: codesStats.isPending,
    },
    {
      label: 'New users',
      value: ut?.new ?? 0,
      changePct: ut?.newChangePct,
      help: 'Customers whose first-ever activity in the workspace happened in this period',
      loading: usersStats.isPending,
    },
  ];

  const list = distributors.data ?? [];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography
        sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px', mb: 3 }}
      >
        Distributors
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <PeriodControl value={period} onChange={setPeriod} onRefresh={refetchAll} />
        <Button>Invite distributor</Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 4,
        }}
      >
        {summary.map((s) => (
          <Paper
            key={s.label}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${colors.interface.grey3}`,
              boxShadow: customShadows.soft,
              bgcolor: colors.interface.white,
            }}
          >
            <StatTile
              label={s.label}
              value={numberFmt.format(s.value)}
              changePct={s.changePct}
              help={s.help}
              loading={s.loading}
            />
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {list.map((item) => (
          <DistributorCard
            key={item.membershipId}
            item={item}
            status={statusByMembership.get(item.membershipId)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DistributorsPage;
