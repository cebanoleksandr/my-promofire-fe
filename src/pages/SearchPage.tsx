import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useCampaigns, useCustomers, usePromoCodes } from '../network/hooks';
import {
  Button,
  DateLabel,
  EmptyState,
  PromoCodeDisplayStatusChip,
  StatusChip,
  Table,
} from '../components/ui';
import { colors } from '../theme';
import type { PromoCodeListItem } from '../types/promo-code';
import type { CampaignListItem } from '../types/campaign';
import type { CustomerListItem } from '../types/customer';

const numberFmt = new Intl.NumberFormat('en-US');

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 600, lineHeight: '26px', mb: 1.5 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

const SearchPage = () => {
  const { t } = useTranslation('search');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';

  const term = q.trim().toLowerCase();
  const hasTerm = term.length > 0;

  const codesQuery = usePromoCodes({ limit: 100 });
  const campaignsQuery = useCampaigns({ limit: 100 });
  const usersQuery = useCustomers({ limit: 100 });

  const codes = hasTerm
    ? (codesQuery.data?.data ?? []).filter((c) =>
        c.code.toLowerCase().includes(term),
      )
    : [];

  const campaigns = hasTerm
    ? (campaignsQuery.data?.data ?? []).filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.distributors.some((d) => d.name.toLowerCase().includes(term)),
      )
    : [];

  const users = hasTerm
    ? (usersQuery.data?.data ?? []).filter(
        (u) =>
          (u.name ?? '').toLowerCase().includes(term) ||
          (u.email ?? '').toLowerCase().includes(term) ||
          u.externalCustomerId.toLowerCase().includes(term),
      )
    : [];

  const data = { codes, campaigns, users };
  const loading =
    hasTerm &&
    (codesQuery.isPending || campaignsQuery.isPending || usersQuery.isPending);

  const hasResults =
    codes.length > 0 || campaigns.length > 0 || users.length > 0;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Button
        variant="white"
        size="M"
        startIcon={<ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate(-1)}
      >
        {t('back')}
      </Button>

      <Typography
        sx={{ mt: 2, fontSize: 24, fontWeight: 700, lineHeight: '32px' }}
      >
        {t('resultsFor', { query: q })}
      </Typography>
      <Box
        sx={{ mt: 2, borderBottom: `1px solid ${colors.interface.grey3}` }}
      />

      {!loading && !hasResults && (
        <EmptyState
          sx={{ mt: 4 }}
          title={t('noResults.title')}
          description={t('noResults.description', { query: q })}
        />
      )}

      {(loading || codes.length > 0) && (
      <Section title={t('sections.codes.title')}>
        <Table<PromoCodeListItem>
          rows={data?.codes ?? []}
          getRowKey={(r) => r.id}
          loading={loading}
          onRowClick={(r) => navigate(`/codes/${r.id}`)}
          emptyContent={t('sections.codes.empty')}
          columns={[
            {
              id: 'code',
              header: t('sections.codes.columns.name'),
              cell: (r) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContentCopyRoundedIcon
                    sx={{ fontSize: 16, color: colors.interface.grey }}
                  />
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}
                  >
                    {r.code}
                  </Typography>
                </Box>
              ),
            },
            {
              id: 'status',
              header: t('sections.codes.columns.status'),
              cell: (r) => <PromoCodeDisplayStatusChip status={r.displayStatus} />,
            },
            {
              id: 'actions',
              header: t('sections.codes.columns.actions'),
              align: 'right',
              help: t('sections.codes.columns.actionsHelp'),
              cell: (r) => numberFmt.format(r.actions),
            },
            {
              id: 'newUsers',
              header: t('sections.codes.columns.newUsers'),
              align: 'right',
              help: t('sections.codes.columns.newUsersHelp'),
              cell: (r) => numberFmt.format(r.newUsers),
            },
            {
              id: 'lifetime',
              header: t('sections.codes.columns.lifetime'),
              align: 'right',
              help: t('sections.codes.columns.lifetimeHelp'),
              cell: (r) =>
                r.lifetime ? <DateLabel from={r.lifetime} withIcon={false} /> : '∞',
            },
          ]}
        />
      </Section>
      )}

      {(loading || campaigns.length > 0) && (
      <Section title={t('sections.campaigns.title')}>
        <Table<CampaignListItem>
          rows={data?.campaigns ?? []}
          getRowKey={(r) => r.id}
          loading={loading}
          onRowClick={(r) => navigate(`/campaigns/${r.id}`)}
          emptyContent={t('sections.campaigns.empty')}
          columns={[
            {
              id: 'name',
              header: t('sections.campaigns.columns.name'),
              cell: (r) => (
                <Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}
                  >
                    {r.name}
                  </Typography>
                  {r.distributors.length > 0 && (
                    <Typography sx={{ fontSize: 13, color: colors.interface.grey }}>
                      {t('sections.campaigns.distributor')}{' '}
                      <Box
                        component="span"
                        sx={{ color: colors.brand.main, fontWeight: 500 }}
                      >
                        {r.distributors.map((d) => d.name).join(', ')}
                      </Box>
                    </Typography>
                  )}
                </Box>
              ),
            },
            {
              id: 'status',
              header: t('sections.campaigns.columns.status'),
              align: 'right',
              cell: (r) => (
                <StatusChip
                  label={r.isActive ? t('sections.campaigns.active') : t('sections.campaigns.deactivated')}
                  tone={r.isActive ? 'success' : 'neutral'}
                />
              ),
            },
            {
              id: 'generated',
              header: t('sections.campaigns.columns.generated'),
              align: 'right',
              help: t('sections.campaigns.columns.generatedHelp'),
              cell: (r) => numberFmt.format(r.generated),
            },
            {
              id: 'redeemed',
              header: t('sections.campaigns.columns.redeemed'),
              align: 'right',
              help: t('sections.campaigns.columns.redeemedHelp'),
              cell: (r) => numberFmt.format(r.redeemed),
            },
            {
              id: 'newUsers',
              header: t('sections.campaigns.columns.newUsers'),
              align: 'right',
              help: t('sections.campaigns.columns.newUsersHelp'),
              cell: (r) => numberFmt.format(r.newUsers),
            },
          ]}
        />
      </Section>
      )}

      {(loading || users.length > 0) && (
      <Section title={t('sections.users.title')}>
        <Table<CustomerListItem>
          rows={data?.users ?? []}
          getRowKey={(r) => r.id}
          loading={loading}
          onRowClick={(r) => navigate(`/users/${r.id}`)}
          emptyContent={t('sections.users.empty')}
          columns={[
            {
              id: 'name',
              header: t('sections.users.columns.name'),
              cell: (r) => (
                <Typography
                  sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}
                >
                  {r.name || r.externalCustomerId}
                </Typography>
              ),
            },
            {
              id: 'email',
              header: t('sections.users.columns.email'),
              cell: (r) => r.email ?? '—',
            },
            {
              id: 'lastSeenAt',
              header: t('sections.users.columns.lastSession'),
              align: 'right',
              cell: (r) => <DateLabel from={r.lastSeenAt} withIcon={false} />,
            },
          ]}
        />
      </Section>
      )}
    </Box>
  );
};

export default SearchPage;
