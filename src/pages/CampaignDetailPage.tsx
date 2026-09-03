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
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { StatsPeriod, type DateRangeParams } from '../types';
import {
  useActivateCampaign,
  useAssignDistributor,
  useCampaign,
  useCampaignDistributors,
  useCodesStats,
  useCountriesBreakdown,
  useDeactivateCampaign,
  useDeleteCampaign,
  useDevicesBreakdown,
  useGeneratePromoCodes,
  useMyTeam,
  usePromoCodesForCampaign,
  useRestoreCampaign,
  useUnassignDistributor,
  useUpdateCampaign,
  useUsersStats,
} from '../network/hooks';
import { useAppDispatch } from '../store/hooks';
import { setAlertAC } from '../store/alertSlice';
import {
  Button,
  DateLabel,
  Pagination,
  PeriodControl,
  PromoCodeDisplayStatusChip,
  Select,
  StatusChip,
  Table,
  Textarea,
} from '../components/ui';
import { GenerateCodePopup } from '../components/popups/GenerateCodePopup';
import { DonutCard, StatTile } from '../components/dashboard';
import { CampaignStatusFilter } from '../types/campaign';
import { Role } from '../types/membership';
import { colors, customShadows } from '../theme';
import type { StatusTone } from '../components/ui';
import type { PromoCodeListItem } from '../types/promo-code';

const numberFmt = new Intl.NumberFormat('en-US');
const PAGE_SIZE = 8;

const deviceLabels: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  unknown: 'Unknown',
};

const statusChip: Record<CampaignStatusFilter, { label: string; tone: StatusTone }> = {
  [CampaignStatusFilter.ACTIVE]: { label: 'Active', tone: 'success' },
  [CampaignStatusFilter.DEACTIVATED]: { label: 'Deactivated', tone: 'neutral' },
  [CampaignStatusFilter.ARCHIVED]: { label: 'Archived', tone: 'warning' },
};

function InfoRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 0.75 }}>
      <Typography
        sx={{ width: 120, flexShrink: 0, fontSize: 13, color: colors.interface.grey }}
      >
        {label}
        {hint && (
          <Box component="span" title={hint} sx={{ ml: 0.5, cursor: 'help' }}>
            ⓘ
          </Box>
        )}
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
  helperText,
  saving,
  onSave,
}: {
  value: string;
  helperText?: string;
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
        helperText={helperText}
        minRows={5}
        onChange={(e) => setDraft(e.target.value)}
      />
      <Box sx={{ position: 'absolute', right: 8, bottom: helperText ? 28 : 8, display: 'flex', gap: 0.5 }}>
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

const CampaignDetailPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [period, setPeriod] = useState<DateRangeParams>({ period: StatsPeriod.MONTH });
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  const campaign = useCampaign(campaignId);
  const codesStats = useCodesStats(period);
  const usersStats = useUsersStats(period);
  const devices = useDevicesBreakdown(period);
  const countries = useCountriesBreakdown(period);
  const codes = usePromoCodesForCampaign(campaignId, { ...period, page, limit: PAGE_SIZE });
  const assigned = useCampaignDistributors(campaignId);
  const team = useMyTeam({ role: Role.DISTRIBUTOR, limit: 100 });

  const generate = useGeneratePromoCodes();
  const updateCampaign = useUpdateCampaign();
  const assign = useAssignDistributor();
  const unassign = useUnassignDistributor();
  const activate = useActivateCampaign();
  const deactivate = useDeactivateCampaign();
  const archive = useDeleteCampaign();
  const restore = useRestoreCampaign();

  const c = campaign.data;

  const assignableOptions = useMemo(() => {
    const taken = new Set((assigned.data ?? []).map((d) => d.membershipId));
    return (team.data?.data ?? [])
      .filter((m) => !taken.has(m.id))
      .map((m) => ({ value: m.id, label: m.displayName, caption: m.email }));
  }, [team.data?.data, assigned.data]);

  const toastErr = (e: { message: string }) =>
    dispatch(setAlertAC({ text: e.message, mode: 'error' }));

  if (campaign.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!c) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', py: 6 }}>
        <Typography>Campaign not found.</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/campaigns')}>
          Back to campaigns
        </Button>
      </Box>
    );
  }

  const isArchived = c.displayStatus === CampaignStatusFilter.ARCHIVED;
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
          onClick={() => navigate('/campaigns')}
        >
          Campaign
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          {c.name}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          aria-label="Campaign actions"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ border: `1px solid ${colors.interface.grey3}`, borderRadius: '8px' }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {isArchived ? (
            <MenuItem
              onClick={() =>
                runMenu(() => restore.mutate(c.id, { onError: toastErr }))
              }
            >
              Restore
            </MenuItem>
          ) : (
            [
              c.isActive ? (
                <MenuItem
                  key="deact"
                  onClick={() =>
                    runMenu(() => deactivate.mutate(c.id, { onError: toastErr }))
                  }
                >
                  Deactivate
                </MenuItem>
              ) : (
                <MenuItem
                  key="act"
                  onClick={() =>
                    runMenu(() => activate.mutate(c.id, { onError: toastErr }))
                  }
                >
                  Activate
                </MenuItem>
              ),
              <MenuItem
                key="arch"
                onClick={() =>
                  runMenu(() =>
                    archive.mutate(c.id, {
                      onSuccess: () => navigate('/campaigns'),
                      onError: toastErr,
                    }),
                  )
                }
                sx={{ color: colors.supportive.red }}
              >
                Archive
              </MenuItem>,
            ]
          )}
        </Menu>
      </Box>

      {/* Тулбар */}
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
        <PeriodControl
          value={period}
          onChange={setPeriod}
          onRefresh={() => {
            codesStats.refetch();
            usersStats.refetch();
            devices.refetch();
            countries.refetch();
            codes.refetch();
          }}
        />
        <Button disabled={isArchived} onClick={() => setGenerateOpen(true)}>
          Generate code
        </Button>
      </Box>

      <GenerateCodePopup
        isVisible={generateOpen}
        loading={generate.isPending}
        onClose={() => setGenerateOpen(false)}
        onGenerate={(customCode) =>
          generate.mutate(
            { campaignId: c.id, customCode },
            {
              onSuccess: () => {
                setGenerateOpen(false);
                dispatch(setAlertAC({ text: 'Code generated', mode: 'success' }));
              },
              onError: toastErr,
            },
          )
        }
      />

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Левая колонка */}
        <Box sx={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            <InfoRow label="Creator">
              <Tooltip title={`${c.creator.displayName} (${c.creator.email})`}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'bottom',
                    color: colors.brand.main,
                    fontWeight: 500,
                  }}
                >
                  {c.creator.displayName}
                </Box>
              </Tooltip>
            </InfoRow>
            <InfoRow label="Status">
              <StatusChip {...statusChip[c.displayStatus]} />
            </InfoRow>
            <InfoRow label="Created">
              <DateLabel from={c.createdAt} withIcon={false} />
            </InfoRow>
            <InfoRow label="Code lifetime" hint="Per-code TTL counted from generation">
              {c.ttlAmount && c.ttlUnit
                ? `${c.ttlAmount} ${c.ttlUnit}${c.ttlAmount > 1 ? 's' : ''}`
                : '—'}
            </InfoRow>
            <InfoRow label="Redemption limit" hint="Default max redemptions per code">
              {c.defaultMaxRedemptions ?? 'Unlimited'}
            </InfoRow>
            <InfoRow label="Mutable" hint="Can code payload be edited after generation">
              {c.payloadMutable ? 'Yes' : 'No'}
            </InfoRow>
            <InfoRow label="Changed">
              <DateLabel from={c.updatedAt} withIcon={false} />
            </InfoRow>
          </Paper>

          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1.5 }}>Distributors</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(assigned.data ?? []).map((d) => (
                <Box
                  key={d.membershipId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    minHeight: 42,
                    px: 1.5,
                    borderRadius: '8px',
                    border: `1px solid ${colors.interface.grey3}`,
                    bgcolor: colors.interface.white,
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>{d.displayName}</Typography>
                  <IconButton
                    size="small"
                    aria-label={`Remove ${d.displayName}`}
                    disabled={unassign.isPending}
                    onClick={() =>
                      unassign.mutate(
                        { campaignId: c.id, distributorMembershipId: d.membershipId },
                        { onError: toastErr },
                      )
                    }
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: colors.interface.grey }} />
                  </IconButton>
                </Box>
              ))}

              <Select
                options={assignableOptions}
                value={null}
                placeholder="Set distributor"
                emptyText="No distributors to add"
                onChange={(membershipId) =>
                  assign.mutate(
                    { campaignId: c.id, distributorMembershipId: membershipId },
                    { onError: toastErr },
                  )
                }
              />
            </Box>
          </Box>
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

          <Section
            title="Codes"
            action={
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.brand.main, cursor: 'pointer' }}
                onClick={() => navigate('/codes')}
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
              emptyContent="No codes for this campaign yet"
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

          <Section title="Descriptions">
            <EditableTextarea
              value={c.description ?? ''}
              saving={updateCampaign.isPending}
              onSave={(description) =>
                updateCampaign.mutate(
                  { id: c.id, dto: { description } },
                  { onError: toastErr },
                )
              }
            />
          </Section>

          <Section title="Initial payload">
            <EditableTextarea
              value={c.payload ? JSON.stringify(c.payload, null, 2) : ''}
              helperText="You can change the code payload after creating a template if the mutable feature is enabled"
              saving={updateCampaign.isPending}
              onSave={(raw) => {
                let payload: Record<string, unknown>;
                try {
                  payload = raw.trim() ? JSON.parse(raw) : {};
                } catch {
                  dispatch(setAlertAC({ text: 'Payload is not valid JSON', mode: 'error' }));
                  return;
                }
                updateCampaign.mutate({ id: c.id, dto: { payload } }, { onError: toastErr });
              }}
            />
          </Section>
        </Box>
      </Box>
    </Box>
  );
};

export default CampaignDetailPage;
