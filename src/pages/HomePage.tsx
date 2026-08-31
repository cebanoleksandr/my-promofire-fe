import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import { StatsPeriod, type DateRangeParams } from '../types';
import {
  useCampaigns,
  useCodesStats,
  useCountriesBreakdown,
  useDevicesBreakdown,
  usePromoCodes,
  useUsersStats,
} from '../network/hooks';
import {
  Button,
  EmptyState,
  PeriodControl,
  Table,
  PromoCodeStatusChip,
  StatusChip,
} from '../components/ui';
import {
  DonutCard,
  SectionHeading,
  StatsChartCard,
  TrendAreaChart,
  seriesColors,
} from '../components/dashboard';
import type { PromoCode } from '../types/promo-code';
import type { Campaign } from '../types/campaign';

const deviceLabels: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  unknown: 'Unknown',
};

const HomePage = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<DateRangeParams>({
    period: StatsPeriod.MONTH,
  });

  const codesStats = useCodesStats(period);
  const usersStats = useUsersStats(period);
  const countries = useCountriesBreakdown(period);
  const devices = useDevicesBreakdown(period);
  const codes = usePromoCodes({ ...period, limit: 5 });
  const campaigns = useCampaigns({ limit: 6 });

  const refetchAll = () => {
    codesStats.refetch();
    usersStats.refetch();
    countries.refetch();
    devices.refetch();
    codes.refetch();
    campaigns.refetch();
  };

  const ct = codesStats.data?.totals;
  const ut = usersStats.data?.totals;

  const settled =
    !codesStats.isPending &&
    !usersStats.isPending &&
    !codes.isPending &&
    !campaigns.isPending;

  // Пока не знаем, пустой ли воркспейс — показываем лоадер, а не дашборд,
  // иначе на перезагрузке дашборд мигает и сменяется на empty state.
  if (!settled) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const hasActivity =
    (codes.data?.data.length ?? 0) > 0 ||
    (campaigns.data?.data.length ?? 0) > 0 ||
    (ct?.generated ?? 0) > 0 ||
    (ut?.all ?? 0) > 0;

  if (settled && !hasActivity) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <EmptyState
          icon={<RocketLaunchOutlinedIcon />}
          title="Nothing here yet"
          description="Create your first campaign and generate promo codes — stats, charts and activity will show up here."
          action={
            <Button onClick={() => navigate('/campaigns/create')}>
              Create campaign
            </Button>
          }
          sx={{ mt: 8 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
        <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px' }}>
          Welcome to promo updates
        </Typography>
        <PeriodControl value={period} onChange={setPeriod} onRefresh={refetchAll} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
        {/* Левая колонка */}
        <Box
          sx={{
            flex: '1 1 640px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Box>
            <SectionHeading title="Codes" />
            <StatsChartCard
              tiles={[
                {
                  label: 'Generated',
                  value: ct?.generated ?? 0,
                  changePct: ct?.generatedChangePct,
                  color: seriesColors.generated,
                  loading: codesStats.isPending,
                },
                {
                  label: 'Redeemed',
                  value: ct?.redeemed ?? 0,
                  changePct: ct?.redeemedChangePct,
                  color: seriesColors.redeemed,
                  loading: codesStats.isPending,
                },
                {
                  label: 'Expired',
                  value: ct?.expired ?? 0,
                  changePct: ct?.expiredChangePct,
                  color: seriesColors.expired,
                  loading: codesStats.isPending,
                },
              ]}
              chart={
                <TrendAreaChart
                  loading={codesStats.isPending}
                  data={codesStats.data?.series ?? []}
                  xKey="date"
                  series={[
                    { key: 'generated', label: 'Generated', color: seriesColors.generated },
                    { key: 'redeemed', label: 'Redeemed', color: seriesColors.redeemed },
                    { key: 'expired', label: 'Expired', color: seriesColors.expired },
                  ]}
                />
              }
            />
          </Box>

          <Box>
            <SectionHeading title="Users" />
            <StatsChartCard
              tiles={[
                {
                  label: 'All users',
                  value: ut?.all ?? 0,
                  changePct: ut?.allChangePct,
                  color: seriesColors.all,
                  loading: usersStats.isPending,
                },
                {
                  label: 'Active users',
                  value: ut?.active ?? 0,
                  changePct: ut?.activeChangePct,
                  color: seriesColors.active,
                  loading: usersStats.isPending,
                },
                {
                  label: 'New users',
                  value: ut?.new ?? 0,
                  changePct: ut?.newChangePct,
                  color: seriesColors.new,
                  loading: usersStats.isPending,
                },
              ]}
              chart={
                <TrendAreaChart
                  loading={usersStats.isPending}
                  data={usersStats.data?.series ?? []}
                  xKey="date"
                  series={[
                    { key: 'active', label: 'Active', color: seriesColors.active },
                    { key: 'new', label: 'New', color: seriesColors.new },
                  ]}
                />
              }
            />
          </Box>

          <Box>
            <SectionHeading title="Codes" actionHref="/codes" />
            <Table<PromoCode>
              rows={codes.data?.data ?? []}
              getRowKey={(r) => r.id}
              loading={codes.isPending}
              columns={[
                { id: 'code', header: 'Name', cell: (r) => r.code },
                {
                  id: 'status',
                  header: 'Status',
                  cell: (r) => <PromoCodeStatusChip status={r.status} />,
                },
                {
                  id: 'redeemed',
                  header: 'Redeemed',
                  cell: (r) => r.redemptionsCount,
                },
                {
                  id: 'limit',
                  header: 'Max redemptions',
                  cell: (r) => (r.maxRedemptions === 0 ? '∞' : r.maxRedemptions),
                },
              ]}
            />
          </Box>

          <Box>
            <SectionHeading title="Campaigns" actionHref="/campaigns" />
            <Table<Campaign>
              rows={campaigns.data?.data ?? []}
              getRowKey={(r) => r.id}
              loading={campaigns.isPending}
              columns={[
                { id: 'name', header: 'Name', cell: (r) => r.name },
                {
                  id: 'discount',
                  header: 'Discount',
                  cell: (r) =>
                    r.discountType === 'percentage'
                      ? `${r.discountValue}%`
                      : r.discountValue,
                },
                {
                  id: 'status',
                  header: 'Status',
                  cell: (r) => (
                    <StatusChip
                      label={r.isActive ? 'Active' : 'Deactivated'}
                      tone={r.isActive ? 'success' : 'neutral'}
                    />
                  ),
                },
                {
                  id: 'perCustomer',
                  header: 'Per customer',
                  cell: (r) => r.perCustomerLimit,
                },
              ]}
            />
          </Box>
        </Box>

        {/* Правая колонка */}
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <DonutCard
            title="Countries"
            loading={countries.isPending}
            items={countries.data?.items ?? []}
            labelFor={(key) => key.toUpperCase()}
          />
          <DonutCard
            title="Devices"
            loading={devices.isPending}
            items={devices.data?.items ?? []}
            labelFor={(key) => deviceLabels[key] ?? key}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
