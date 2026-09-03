import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { StatsPeriod, type DateRangeParams } from '../types';
import {
  useCustomer,
  useCustomerCodes,
  useCustomerCountriesBreakdown,
  useCustomerDevicesBreakdown,
  useUpdateCustomer,
} from '../network/hooks';
import { useAppDispatch } from '../store/hooks';
import { setAlertAC } from '../store/alertSlice';
import {
  Button,
  DateLabel,
  Pagination,
  PeriodControl,
  PromoCodeDisplayStatusChip,
  Table,
  Textarea,
} from '../components/ui';
import { DonutCard, StatTile } from '../components/dashboard';
import { colors, customShadows } from '../theme';
import type { PromoCodeListItem } from '../types/promo-code';

const numberFmt = new Intl.NumberFormat('en-US');
const PAGE_SIZE = 8;

const deviceLabels: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  unknown: 'Unknown',
};

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

// Однострочный текст с троеточием при переполнении и тултипом с полным значением
function TruncatedText({ text, sx }: { text: string; sx?: object }) {
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

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [period, setPeriod] = useState<DateRangeParams>({ period: StatsPeriod.MONTH });
  const [page, setPage] = useState(1);

  const customer = useCustomer(id, period);
  const devices = useCustomerDevicesBreakdown(id, period);
  const countries = useCustomerCountriesBreakdown(id, period);
  const codes = useCustomerCodes(id, { ...period, page, limit: PAGE_SIZE });

  const updateCustomer = useUpdateCustomer();

  const u = customer.data;

  const toastErr = (e: { message: string }) =>
    dispatch(setAlertAC({ text: e.message, mode: 'error' }));

  if (customer.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!u) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', py: 6 }}>
        <Typography>User not found.</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/users')}>
          Back to users
        </Button>
      </Box>
    );
  }

  // Берём id из URL, а не из ответа API — на некоторых бэкендах Customer
  // в ответе GET /users/:id почему-то не отдаёт своё же id
  const customerId = id as string;
  const displayName = u.name || u.externalCustomerId;
  const totalPages = codes.data?.meta.totalPages ?? 1;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Хлебные крошки */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate('/users')}
        >
          Users
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          {displayName}
        </Typography>
      </Box>

      {/* Тулбар */}
      <Box sx={{ mb: 3 }}>
        <PeriodControl
          value={period}
          onChange={setPeriod}
          onRefresh={() => {
            customer.refetch();
            devices.refetch();
            countries.refetch();
            codes.refetch();
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
              <TruncatedText text={displayName} />
            </InfoRow>
            <InfoRow label="Email">
              {u.email ? <TruncatedText text={u.email} /> : '—'}
            </InfoRow>
            <InfoRow label="Phone">{u.phone ?? '—'}</InfoRow>
            <InfoRow label="Joined">
              <DateLabel from={u.firstSeenAt} withIcon={false} />
            </InfoRow>
            <InfoRow label="Last session">
              <DateLabel from={u.lastSeenAt} withIcon={false} />
            </InfoRow>
          </Paper>
        </Box>

        {/* Правая колонка */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
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
                label="Actions"
                value={numberFmt.format(u.totals.actions)}
                changePct={u.totals.actionsChangePct}
                help="All code lookups (validate + redeem), not only successful redemptions"
                loading={customer.isFetching}
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
                label="Redeemed"
                value={numberFmt.format(u.totals.redeemed)}
                changePct={u.totals.redeemedChangePct}
                help="Successfully redeemed codes"
                loading={customer.isFetching}
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
                label="Codes used"
                value={numberFmt.format(u.totals.codesUsed)}
                changePct={u.totals.codesUsedChangePct}
                loading={customer.isFetching}
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
              value={u.description ?? ''}
              saving={updateCustomer.isPending}
              onSave={(description) =>
                updateCustomer.mutate(
                  { id: customerId, dto: { description } },
                  { onError: toastErr },
                )
              }
            />
          </Section>

          <Section
            title="Codes"
            action={
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.brand.main, cursor: 'pointer' }}
                onClick={() => navigate(`/users/${customerId}/codes`)}
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
              emptyContent="No codes used yet"
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

export default UserDetailPage;
