import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { StatsPeriod, type DateRangeParams } from '../types';
import {
  useActivateMember,
  useCountriesBreakdown,
  useCodesStats,
  useDeactivateMember,
  useDevicesBreakdown,
  useDistributor,
  useDistributorsBreakdown,
  usePromoCodes,
  useRemoveMember,
  useUpdateDistributorDetail,
  useUsersStats,
} from '../network/hooks';
import { useAppDispatch } from '../store/hooks';
import { setAlertAC } from '../store/alertSlice';
import {
  Button,
  DateLabel,
  MemberStatusChip,
  Pagination,
  PeriodControl,
  PromoCodeDisplayStatusChip,
  Table,
  Textarea,
} from '../components/ui';
import { DonutCard, StatTile } from '../components/dashboard';
import { colors, customShadows } from '../theme';
import type { PromoCodeListItem } from '../types/promo-code';
import type { DistributorCampaignBreakdown } from '../types/stats';

const numberFmt = new Intl.NumberFormat('en-US');
const PAGE_SIZE = 8;

const deviceLabels: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  unknown: 'Unknown',
};

// Однострочный текст с троеточием при переполнении и тултипом с полным значением
function TruncatedText({
  text,
  sx,
}: {
  text: string;
  sx?: object;
}) {
  return (
    <Tooltip title={text}>
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          verticalAlign: 'bottom',
          ...sx,
        }}
      >
        {text}
      </Box>
    </Tooltip>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 0.75 }}>
      <Typography
        sx={{ width: 90, flexShrink: 0, fontSize: 13, color: colors.interface.grey }}
      >
        {label}
      </Typography>
      <Box sx={{ fontSize: 14, color: colors.interface.black, textAlign: 'right', flex: 1, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>{title}</Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}

// Многострочное поле с подтверждением правки (карандаш → Save / Cancel)
function EditableTextarea({
  value,
  saving,
  onSave,
}: {
  value: string;
  saving?: boolean;
  onSave: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };
  const confirm = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Textarea
        value={draft}
        disabled={!editing || saving}
        minRows={5}
        onChange={(e) => setDraft(e.target.value)}
      />
      <Box sx={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 0.5 }}>
        {editing ? (
          <>
            <IconButton size="small" aria-label="Save" disabled={saving} onClick={confirm}>
              <CheckRoundedIcon sx={{ fontSize: 18, color: colors.brand.main }} />
            </IconButton>
            <IconButton size="small" aria-label="Cancel" disabled={saving} onClick={cancel}>
              <CloseRoundedIcon sx={{ fontSize: 18, color: colors.interface.grey }} />
            </IconButton>
          </>
        ) : (
          <IconButton size="small" aria-label="Edit" onClick={() => setEditing(true)}>
            <BorderColorOutlinedIcon sx={{ fontSize: 16, color: colors.interface.grey }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

const DistributorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [period, setPeriod] = useState<DateRangeParams>({ period: StatsPeriod.MONTH });
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const distributor = useDistributor(id);
  const statsParams = { ...period, distributorMembershipId: id };
  const codesStats = useCodesStats(statsParams);
  const usersStats = useUsersStats(statsParams);
  const devices = useDevicesBreakdown(statsParams);
  const countries = useCountriesBreakdown(statsParams);
  const codes = usePromoCodes({ ...period, distributorMembershipId: id, page, limit: PAGE_SIZE });
  const breakdown = useDistributorsBreakdown(period);

  const updateDetail = useUpdateDistributorDetail();
  const deactivate = useDeactivateMember();
  const activate = useActivateMember();
  const remove = useRemoveMember();

  const d = distributor.data;

  const campaigns = useMemo<DistributorCampaignBreakdown[]>(
    () => breakdown.data?.find((b) => b.membershipId === id)?.campaigns ?? [],
    [breakdown.data, id],
  );

  const toastErr = (e: { message: string }) =>
    dispatch(setAlertAC({ text: e.message, mode: 'error' }));

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

  const ct = codesStats.data?.totals;
  const ut = usersStats.data?.totals;

  const kpis = [
    { label: 'Actions', value: ct?.actions ?? 0, changePct: ct?.actionsChangePct, loading: codesStats.isPending },
    { label: 'Generated', value: ct?.generated ?? 0, changePct: ct?.generatedChangePct, loading: codesStats.isPending },
    { label: 'Redeemed', value: ct?.redeemed ?? 0, changePct: ct?.redeemedChangePct, loading: codesStats.isPending },
    { label: 'Expired', value: ct?.expired ?? 0, changePct: ct?.expiredChangePct, loading: codesStats.isPending },
    { label: 'New users', value: ut?.new ?? 0, changePct: ut?.newChangePct, loading: usersStats.isPending },
  ];

  const runMenu = (fn: () => void) => {
    setMenuAnchor(null);
    fn();
  };

  const totalPages = codes.data?.meta.totalPages ?? 1;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Хлебные крошки + меню */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate('/distributors')}
        >
          Distributors
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          {d.displayName}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          aria-label="Distributor actions"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ border: `1px solid ${colors.interface.grey3}`, borderRadius: '8px' }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {d.isActive ? (
            <MenuItem
              onClick={() => runMenu(() => deactivate.mutate(d.id, { onError: toastErr }))}
            >
              Deactivate
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => runMenu(() => activate.mutate(d.id, { onError: toastErr }))}
            >
              Activate
            </MenuItem>
          )}
          <MenuItem
            onClick={() =>
              runMenu(() =>
                remove.mutate(d.id, {
                  onSuccess: () => navigate('/distributors'),
                  onError: toastErr,
                }),
              )
            }
            sx={{ color: colors.supportive.red }}
          >
            Remove
          </MenuItem>
        </Menu>
      </Box>

      {/* Тулбар */}
      <Box sx={{ mb: 3 }}>
        <PeriodControl
          value={period}
          onChange={setPeriod}
          onRefresh={() => {
            codesStats.refetch();
            usersStats.refetch();
            devices.refetch();
            countries.refetch();
            codes.refetch();
            breakdown.refetch();
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Левая колонка */}
        <Box sx={{ width: 320, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${colors.interface.grey3}`,
              boxShadow: customShadows.soft,
              bgcolor: colors.interface.white,
            }}
          >
            <InfoRow label="Name">
              <TruncatedText
                text={d.displayName}
                sx={{ color: colors.brand.main, fontWeight: 500 }}
              />
            </InfoRow>
            <InfoRow label="Email">
              <TruncatedText text={d.email} />
            </InfoRow>
            <InfoRow label="Status">
              <MemberStatusChip status={d.status} isActive={d.isActive} />
            </InfoRow>
            <InfoRow label="Joined">
              <DateLabel from={d.createdAt} withIcon={false} />
            </InfoRow>
          </Paper>
        </Box>

        {/* Правая колонка */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {kpis.map((k) => (
              <Paper
                key={k.label}
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
                  label={k.label}
                  value={numberFmt.format(k.value)}
                  changePct={k.changePct}
                  loading={k.loading}
                />
              </Paper>
            ))}
          </Box>

          <Box
            sx={{
              mt: 4,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            <DonutCard
              title="Devices"
              loading={devices.isPending}
              items={devices.data?.items ?? []}
              labelFor={(k) => deviceLabels[k] ?? k}
            />
            <DonutCard
              title="Countries"
              loading={countries.isPending}
              items={countries.data?.items ?? []}
              labelFor={(k) => k.toUpperCase()}
            />
          </Box>

          <Section title="Description">
            <EditableTextarea
              value={d.description ?? ''}
              saving={updateDetail.isPending}
              onSave={(description) =>
                updateDetail.mutate(
                  { id: d.id, dto: { description } },
                  { onError: toastErr },
                )
              }
            />
          </Section>

          <Section
            title="Campaign"
            action={
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.brand.main, cursor: 'pointer' }}
                onClick={() => navigate(`/distributors/${d.id}/campaigns`)}
              >
                See all
              </Typography>
            }
          >
            <Table<DistributorCampaignBreakdown>
              rows={campaigns}
              getRowKey={(r) => r.campaignId}
              loading={breakdown.isPending}
              onRowClick={(r) => navigate(`/campaigns/${r.campaignId}`)}
              emptyContent="Not assigned to any campaign yet"
              columns={[
                { id: 'name', header: 'Name', cell: (r) => r.name },
                {
                  id: 'generated',
                  header: 'Generated',
                  align: 'right',
                  help: 'Promo codes generated',
                  cell: (r) => numberFmt.format(r.generated),
                },
                {
                  id: 'redeemed',
                  header: 'Redeemed',
                  align: 'right',
                  help: 'Successfully redeemed codes',
                  cell: (r) => numberFmt.format(r.redeemed),
                },
                {
                  id: 'actions',
                  header: 'Actions',
                  align: 'right',
                  help: 'All code lookups (validate + redeem), not only successful redemptions',
                  cell: (r) => numberFmt.format(r.actions),
                },
                {
                  id: 'newUsers',
                  header: 'New Users',
                  align: 'right',
                  help: 'Customers whose first-ever activity was a code from this campaign',
                  cell: (r) => numberFmt.format(r.newUsers),
                },
              ]}
            />
          </Section>

          <Section
            title="Codes"
            action={
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.brand.main, cursor: 'pointer' }}
                onClick={() => navigate(`/distributors/${d.id}/codes`)}
              >
                See all
              </Typography>
            }
          >
            <Table<PromoCodeListItem>
              rows={codes.data?.data ?? []}
              getRowKey={(r) => r.id}
              loading={codes.isPending}
              onRowClick={(r) => navigate(`/codes/${r.id}`)}
              emptyContent="No codes generated yet"
              columns={[
                {
                  id: 'code',
                  header: 'Name',
                  cell: (r) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ContentCopyRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{r.code}</Typography>
                    </Box>
                  ),
                },
                {
                  id: 'status',
                  header: 'Status',
                  cell: (r) => <PromoCodeDisplayStatusChip status={r.displayStatus} />,
                },
                {
                  id: 'actions',
                  header: 'Actions',
                  align: 'right',
                  help: 'All code lookups (validate + redeem)',
                  cell: (r) => numberFmt.format(r.actions),
                },
                {
                  id: 'newUsers',
                  header: 'New users',
                  align: 'right',
                  help: 'Customers whose first-ever activity was this code',
                  cell: (r) => numberFmt.format(r.newUsers),
                },
                {
                  id: 'lifetime',
                  header: 'Lifetime',
                  align: 'right',
                  cell: (r) => (r.lifetime ? <DateLabel from={r.lifetime} withIcon={false} /> : '∞'),
                },
              ]}
            />
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={setPage} />
              </Box>
            )}
          </Section>
        </Box>
      </Box>
    </Box>
  );
};

export default DistributorDetailPage;
