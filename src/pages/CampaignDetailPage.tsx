import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { ConfirmPopup } from '../components/popups/ConfirmPopup';
import { DonutCard, StatTile } from '../components/dashboard';
import { CampaignStatusFilter } from '../types/campaign';
import { Role } from '../types/membership';
import { colors, customShadows } from '../theme';
import type { StatusTone } from '../components/ui';
import type { PromoCodeListItem } from '../types/promo-code';
import type { AssignedDistributor } from '../types/campaign';

const numberFmt = new Intl.NumberFormat('en-US');
const PAGE_SIZE = 8;

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
  const { t } = useTranslation('campaigns');
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
            <IconButton size="small" aria-label={t('detail.editable.save')} disabled={saving} onClick={confirm}>
              <CheckRoundedIcon sx={{ fontSize: 18, color: colors.brand.main }} />
            </IconButton>
            <IconButton size="small" aria-label={t('detail.editable.cancel')} disabled={saving} onClick={cancel}>
              <CloseRoundedIcon sx={{ fontSize: 18, color: colors.interface.grey }} />
            </IconButton>
          </>
        ) : (
          <IconButton size="small" aria-label={t('detail.editable.edit')} onClick={() => setEditing(true)}>
            <BorderColorOutlinedIcon sx={{ fontSize: 16, color: colors.interface.grey }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

const CampaignDetailPage = () => {
  const { t } = useTranslation('campaigns');
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const deviceLabels: Record<string, string> = {
    ios: 'iOS',
    android: 'Android',
    web: 'Web',
    unknown: t('detail.devices.unknown'),
  };

  const statusChip: Record<CampaignStatusFilter, { label: string; tone: StatusTone }> = {
    [CampaignStatusFilter.ACTIVE]: { label: t('detail.status.active'), tone: 'success' },
    [CampaignStatusFilter.DEACTIVATED]: { label: t('detail.status.deactivated'), tone: 'neutral' },
    [CampaignStatusFilter.ARCHIVED]: { label: t('detail.status.archived'), tone: 'warning' },
  };

  const [period, setPeriod] = useState<DateRangeParams>({ period: StatsPeriod.MONTH });
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [distributorToRemove, setDistributorToRemove] = useState<AssignedDistributor | null>(null);

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
  const toastOk = (text: string) => dispatch(setAlertAC({ text, mode: 'success' }));

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
        <Typography>{t('detail.notFound.title')}</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/campaigns')}>
          {t('detail.notFound.back')}
        </Button>
      </Box>
    );
  }

  const isArchived = c.displayStatus === CampaignStatusFilter.ARCHIVED;
  const ct = codesStats.data?.totals;
  const ut = usersStats.data?.totals;

  const kpis = [
    { label: t('detail.kpi.actions'), value: ct?.actions ?? 0, changePct: ct?.actionsChangePct, loading: codesStats.isPending },
    { label: t('detail.kpi.generated'), value: ct?.generated ?? 0, changePct: ct?.generatedChangePct, loading: codesStats.isPending },
    { label: t('detail.kpi.redeemed'), value: ct?.redeemed ?? 0, changePct: ct?.redeemedChangePct, loading: codesStats.isPending },
    { label: t('detail.kpi.expired'), value: ct?.expired ?? 0, changePct: ct?.expiredChangePct, loading: codesStats.isPending },
    { label: t('detail.kpi.newUsers'), value: ut?.new ?? 0, changePct: ut?.newChangePct, loading: usersStats.isPending },
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
          {t('detail.breadcrumb.campaign')}
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          {c.name}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          aria-label={t('detail.actionsAria')}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ border: `1px solid ${colors.interface.grey3}`, borderRadius: '8px' }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {isArchived ? (
            <MenuItem
              onClick={() =>
                runMenu(() =>
                  restore.mutate(c.id, {
                    onSuccess: () => toastOk(t('detail.toast.restored')),
                    onError: toastErr,
                  }),
                )
              }
            >
              {t('detail.menu.restore')}
            </MenuItem>
          ) : (
            [
              c.isActive ? (
                <MenuItem
                  key="deact"
                  onClick={() =>
                    runMenu(() =>
                      deactivate.mutate(c.id, {
                        onSuccess: () => toastOk(t('detail.toast.deactivated')),
                        onError: toastErr,
                      }),
                    )
                  }
                >
                  {t('detail.menu.deactivate')}
                </MenuItem>
              ) : (
                <MenuItem
                  key="act"
                  onClick={() =>
                    runMenu(() =>
                      activate.mutate(c.id, {
                        onSuccess: () => toastOk(t('detail.toast.activated')),
                        onError: toastErr,
                      }),
                    )
                  }
                >
                  {t('detail.menu.activate')}
                </MenuItem>
              ),
              <MenuItem
                key="arch"
                onClick={() =>
                  runMenu(() =>
                    archive.mutate(c.id, {
                      onSuccess: () => {
                        toastOk(t('detail.toast.archived'));
                        navigate('/campaigns');
                      },
                      onError: toastErr,
                    }),
                  )
                }
                sx={{ color: colors.supportive.red }}
              >
                {t('detail.menu.archive')}
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
          {t('detail.generateCode')}
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
                dispatch(setAlertAC({ text: t('detail.toast.codeGenerated'), mode: 'success' }));
              },
              onError: toastErr,
            },
          )
        }
      />

      <ConfirmPopup
        isVisible={!!distributorToRemove}
        title={t('detail.confirmRemove.title')}
        description={
          distributorToRemove
            ? t('detail.confirmRemove.description', { name: distributorToRemove.displayName })
            : undefined
        }
        confirmLabel={t('detail.confirmRemove.confirm')}
        tone="danger"
        loading={unassign.isPending}
        onClose={() => setDistributorToRemove(null)}
        onConfirm={() => {
          if (!distributorToRemove) return;
          unassign.mutate(
            { campaignId: c.id, distributorMembershipId: distributorToRemove.membershipId },
            {
              onSuccess: () => setDistributorToRemove(null),
              onError: toastErr,
            },
          );
        }}
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
            <InfoRow label={t('detail.info.creator')}>
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
            <InfoRow label={t('detail.info.status')}>
              <StatusChip {...statusChip[c.displayStatus]} />
            </InfoRow>
            <InfoRow label={t('detail.info.created')}>
              <DateLabel from={c.createdAt} withIcon={false} />
            </InfoRow>
            <InfoRow label={t('detail.info.codeLifetime')} hint={t('detail.info.codeLifetimeHint')}>
              {c.ttlAmount && c.ttlUnit
                ? `${c.ttlAmount} ${c.ttlUnit}${c.ttlAmount > 1 ? 's' : ''}`
                : '—'}
            </InfoRow>
            <InfoRow label={t('detail.info.redemptionLimit')} hint={t('detail.info.redemptionLimitHint')}>
              {c.defaultMaxRedemptions ?? t('detail.unlimited')}
            </InfoRow>
            <InfoRow label={t('detail.info.mutable')} hint={t('detail.info.mutableHint')}>
              {c.payloadMutable ? t('detail.yes') : t('detail.no')}
            </InfoRow>
            <InfoRow label={t('detail.info.changed')}>
              <DateLabel from={c.updatedAt} withIcon={false} />
            </InfoRow>
          </Paper>

          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1.5 }}>{t('detail.distributors.title')}</Typography>
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
                    aria-label={t('detail.distributors.removeAria', { name: d.displayName })}
                    onClick={() => setDistributorToRemove(d)}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: colors.interface.grey }} />
                  </IconButton>
                </Box>
              ))}

              <Select
                options={assignableOptions}
                value={null}
                placeholder={t('detail.distributors.placeholder')}
                emptyText={t('detail.distributors.empty')}
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
            title={t('detail.codes.title')}
            action={
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.brand.main, cursor: 'pointer' }}
                onClick={() => navigate(`/campaigns/${c.id}/codes`)}
              >
                {t('detail.codes.seeAll')}
              </Typography>
            }
          >
            <Table<PromoCodeListItem>
              rows={codes.data?.data ?? []}
              getRowKey={(r) => r.id}
              loading={codes.isPending}
              onRowClick={(r) => navigate(`/codes/${r.id}`)}
              emptyContent={t('detail.codes.empty')}
              columns={[
                {
                  id: 'code',
                  header: t('detail.codes.table.name'),
                  cell: (r) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ContentCopyRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{r.code}</Typography>
                    </Box>
                  ),
                },
                {
                  id: 'status',
                  header: t('detail.codes.table.status'),
                  cell: (r) => <PromoCodeDisplayStatusChip status={r.displayStatus} />,
                },
                {
                  id: 'actions',
                  header: t('detail.codes.table.actions'),
                  align: 'right',
                  help: t('detail.codes.table.actionsHelp'),
                  cell: (r) => numberFmt.format(r.actions),
                },
                {
                  id: 'newUsers',
                  header: t('detail.codes.table.newUsers'),
                  align: 'right',
                  help: t('detail.codes.table.newUsersHelp'),
                  cell: (r) => numberFmt.format(r.newUsers),
                },
                {
                  id: 'lifetime',
                  header: t('detail.codes.table.lifetime'),
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
              title={t('detail.devices.title')}
              loading={devices.isPending}
              items={devices.data?.items ?? []}
              labelFor={(k) => deviceLabels[k] ?? k}
            />
            <DonutCard
              title={t('detail.countries.title')}
              loading={countries.isPending}
              items={countries.data?.items ?? []}
              labelFor={(k) => k.toUpperCase()}
            />
          </Box>

          <Section title={t('detail.descriptions.title')}>
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

          <Section title={t('detail.payload.title')}>
            <EditableTextarea
              value={c.payload ? JSON.stringify(c.payload, null, 2) : ''}
              helperText={t('detail.payload.hint')}
              saving={updateCampaign.isPending}
              onSave={(raw) => {
                let payload: Record<string, unknown>;
                try {
                  payload = raw.trim() ? JSON.parse(raw) : {};
                } catch {
                  dispatch(setAlertAC({ text: t('detail.payload.invalidJson'), mode: 'error' }));
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
