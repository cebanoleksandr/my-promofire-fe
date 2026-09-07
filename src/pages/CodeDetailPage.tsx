import { useState } from 'react';
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
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { StatsPeriod, type DateRangeParams } from '../types';
import {
  useCountriesBreakdown,
  useCodesStats,
  useDevicesBreakdown,
  useDisablePromoCode,
  useEnablePromoCode,
  usePromoCode,
  useUsersStats,
} from '../network/hooks';
import { useAppDispatch } from '../store/hooks';
import { setAlertAC } from '../store/alertSlice';
import {
  Button,
  DateLabel,
  PeriodControl,
  PromoCodeDisplayStatusChip,
  Table,
  TextField,
  Textarea,
} from '../components/ui';
import { DonutCard, StatTile } from '../components/dashboard';
import { PromoCodeStatus } from '../types/promo-code';
import { colors, customShadows } from '../theme';
import type { PromoCodeIntegrationBreakdown } from '../types/promo-code';

const numberFmt = new Intl.NumberFormat('en-US');

const deviceLabelKeys: Record<string, string> = {
  ios: 'detail.devices.ios',
  android: 'detail.devices.android',
  web: 'detail.devices.web',
  unknown: 'detail.devices.unknown',
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

const CodeDetailPage = () => {
  const { codeId } = useParams<{ codeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('codes');

  const [period, setPeriod] = useState<DateRangeParams>({ period: StatsPeriod.MONTH });
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const code = usePromoCode(codeId);
  const statsParams = { ...period, promoCodeId: codeId };
  const codesStats = useCodesStats(statsParams);
  const usersStats = useUsersStats(statsParams);
  const devices = useDevicesBreakdown(statsParams);
  const countries = useCountriesBreakdown(statsParams);

  const disable = useDisablePromoCode();
  const enable = useEnablePromoCode();

  const c = code.data;

  const toastErr = (e: { message: string }) =>
    dispatch(setAlertAC({ text: e.message, mode: 'error' }));

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      dispatch(setAlertAC({ text: t('detail.copySuccess'), mode: 'success' }));
    } catch {
      dispatch(setAlertAC({ text: t('detail.copyError'), mode: 'error' }));
    }
  };

  if (code.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!c) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', py: 6 }}>
        <Typography>{t('detail.notFound')}</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/codes')}>
          {t('detail.backToCodes')}
        </Button>
      </Box>
    );
  }

  const ct = codesStats.data?.totals;
  const ut = usersStats.data?.totals;
  const canToggle = c.status === PromoCodeStatus.ACTIVE || c.status === PromoCodeStatus.DISABLED;

  const runMenu = (fn: () => void) => {
    setMenuAnchor(null);
    fn();
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Хлебные крошки + меню */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate('/campaigns')}
        >
          {t('detail.breadcrumbs.campaigns')}
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate(`/campaigns/${c.campaign.id}`)}
        >
          {c.campaign.name}
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          {c.code}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          aria-label={t('detail.codeActions')}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ border: `1px solid ${colors.interface.grey3}`, borderRadius: '8px' }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {canToggle &&
            (c.status === PromoCodeStatus.ACTIVE ? (
              <MenuItem
                onClick={() =>
                  runMenu(() => disable.mutate(c.id, { onError: toastErr }))
                }
              >
                {t('detail.menu.deactivate')}
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() =>
                  runMenu(() => enable.mutate(c.id, { onError: toastErr }))
                }
              >
                {t('detail.menu.activate')}
              </MenuItem>
            ))}
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
            <InfoRow label={t('detail.info.campaign')}>
              <Box
                component="span"
                sx={{ color: colors.brand.main, fontWeight: 500, cursor: 'pointer' }}
                onClick={() => navigate(`/campaigns/${c.campaign.id}`)}
              >
                {c.campaign.name}
              </Box>
            </InfoRow>
            <InfoRow label={t('detail.info.status')}>
              <PromoCodeDisplayStatusChip status={c.displayStatus} />
            </InfoRow>
            <InfoRow label={t('detail.info.released')}>
              <DateLabel from={c.createdAt} withIcon={false} />
            </InfoRow>
            <InfoRow label={t('detail.info.expirationData')}>
              {c.lifetime ? <DateLabel from={c.lifetime} withIcon={false} /> : '∞'}
            </InfoRow>
            <InfoRow label={t('detail.info.creator')}>
              {c.creator ? (
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
              ) : (
                <Box component="span" sx={{ color: colors.interface.grey }}>
                  {t('detail.info.generatedBySdk')}
                </Box>
              )}
            </InfoRow>
            <InfoRow label={t('detail.info.redemptions')} hint={t('detail.help.redemptions')}>
              {numberFmt.format(c.redemptionsCount)} / {c.maxRedemptions ?? '∞'}
            </InfoRow>
            <InfoRow label={t('detail.info.changed')}>
              <DateLabel from={c.updatedAt} withIcon={false} />
            </InfoRow>
          </Paper>
        </Box>

        {/* Правая колонка */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1.5 }}>{t('detail.codeIdLabel')}</Typography>
          <TextField
            value={c.code}
            readOnly
            disabled
            endIcon={
              <IconButton
                size="small"
                aria-label={t('detail.copyCode')}
                onClick={() => copy(c.code)}
                sx={{ p: 0.25 }}
              >
                <ContentCopyRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey }} />
              </IconButton>
            }
          />

          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
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
              <StatTile
                label={t('detail.stats.actions')}
                value={numberFmt.format(ct?.actions ?? 0)}
                changePct={ct?.actionsChangePct}
                help={t('detail.help.actions')}
                loading={codesStats.isPending}
              />
            </Paper>
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
              <StatTile
                label={t('detail.stats.newUsers')}
                value={numberFmt.format(ut?.new ?? 0)}
                changePct={ut?.newChangePct}
                help={t('detail.help.newUsers')}
                loading={usersStats.isPending}
              />
            </Paper>
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
              title={t('detail.devices.title')}
              loading={devices.isPending}
              items={devices.data?.items ?? []}
              labelFor={(k) => (deviceLabelKeys[k] ? t(deviceLabelKeys[k]) : k)}
            />
            <DonutCard
              title={t('detail.countries.title')}
              loading={countries.isPending}
              items={countries.data?.items ?? []}
              labelFor={(k) => k.toUpperCase()}
            />
          </Box>

          <Section title={t('detail.description.title')}>
            <Textarea
              value={c.campaign.description ?? ''}
              disabled
              minRows={5}
            />
          </Section>

          <Section
            title={t('detail.payload.title')}
          >
            <Box sx={{ position: 'relative' }}>
              <Textarea
                value={c.payload ? JSON.stringify(c.payload, null, 2) : ''}
                disabled
                minRows={5}
                helperText={t('detail.payload.helperText')}
              />
              <IconButton
                size="small"
                aria-label={t('detail.payload.copyPayload')}
                onClick={() => copy(c.payload ? JSON.stringify(c.payload, null, 2) : '')}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <ContentCopyRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey }} />
              </IconButton>
            </Box>
          </Section>

          <Section
            title={t('detail.usersSection.title')}
            action={
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.brand.main, cursor: 'pointer' }}
                onClick={() => navigate(`/codes/${c.id}/users`)}
              >
                {t('detail.usersSection.seeAll')}
              </Typography>
            }
          >
            <Table<PromoCodeIntegrationBreakdown>
              rows={c.integrations}
              getRowKey={(r) => r.integrationId}
              emptyContent={t('detail.usersSection.emptyActivity')}
              columns={[
                { id: 'name', header: t('detail.usersSection.columns.name'), cell: (r) => r.name },
                {
                  id: 'actions',
                  header: t('detail.usersSection.columns.actions'),
                  align: 'right',
                  help: t('detail.usersSection.help.actions'),
                  cell: (r) => numberFmt.format(r.actions),
                },
                {
                  id: 'generated',
                  header: t('detail.usersSection.columns.generated'),
                  align: 'right',
                  help: t('detail.usersSection.help.generated'),
                  cell: (r) => numberFmt.format(r.generated),
                },
              ]}
            />
          </Section>
        </Box>
      </Box>
    </Box>
  );
};

export default CodeDetailPage;
