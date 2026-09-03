import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useCampaigns, useIntegrations, usePromoCodes } from '../network/hooks';
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
import type { IntegrationListItem } from '../types/integration';

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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';

  const term = q.trim().toLowerCase();
  const hasTerm = term.length > 0;

  const codesQuery = usePromoCodes({ limit: 100 });
  const campaignsQuery = useCampaigns({ limit: 100 });
  const usersQuery = useIntegrations();

  const codes = useMemo(
    () =>
      hasTerm
        ? (codesQuery.data?.data ?? []).filter((c) =>
            c.code.toLowerCase().includes(term),
          )
        : [],
    [codesQuery.data?.data, term, hasTerm],
  );

  const campaigns = useMemo(
    () =>
      hasTerm
        ? (campaignsQuery.data?.data ?? []).filter(
            (c) =>
              c.name.toLowerCase().includes(term) ||
              c.distributors.some((d) => d.name.toLowerCase().includes(term)),
          )
        : [],
    [campaignsQuery.data?.data, term, hasTerm],
  );

  const users = useMemo(
    () =>
      hasTerm
        ? (usersQuery.data ?? []).filter((u) =>
            u.name.toLowerCase().includes(term),
          )
        : [],
    [usersQuery.data, term, hasTerm],
  );

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
        Back
      </Button>

      <Typography
        sx={{ mt: 2, fontSize: 24, fontWeight: 700, lineHeight: '32px' }}
      >
        Search results for: “{q}”
      </Typography>
      <Box
        sx={{ mt: 2, borderBottom: `1px solid ${colors.interface.grey3}` }}
      />

      {!loading && !hasResults && (
        <EmptyState
          sx={{ mt: 4 }}
          title="No results found"
          description={`We couldn't find anything matching “${q}”`}
        />
      )}

      {(loading || codes.length > 0) && (
      <Section title="Codes">
        <Table<PromoCodeListItem>
          rows={data?.codes ?? []}
          getRowKey={(r) => r.id}
          loading={loading}
          onRowClick={(r) => navigate(`/codes/${r.id}`)}
          emptyContent="No matching codes"
          columns={[
            {
              id: 'code',
              header: 'Name',
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
              header: 'Status',
              cell: (r) => <PromoCodeDisplayStatusChip status={r.displayStatus} />,
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
              header: 'New users',
              align: 'right',
              help: 'Customers whose first-ever activity in the workspace was this code',
              cell: (r) => numberFmt.format(r.newUsers),
            },
            {
              id: 'lifetime',
              header: 'Lifetime',
              align: 'right',
              help: 'When the code stops working — its own expiry, or the campaign default',
              cell: (r) =>
                r.lifetime ? <DateLabel from={r.lifetime} withIcon={false} /> : '∞',
            },
          ]}
        />
      </Section>
      )}

      {(loading || campaigns.length > 0) && (
      <Section title="Campaign">
        <Table<CampaignListItem>
          rows={data?.campaigns ?? []}
          getRowKey={(r) => r.id}
          loading={loading}
          onRowClick={(r) => navigate(`/campaigns/${r.id}`)}
          emptyContent="No matching campaigns"
          columns={[
            {
              id: 'name',
              header: 'Name',
              cell: (r) => (
                <Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}
                  >
                    {r.name}
                  </Typography>
                  {r.distributors.length > 0 && (
                    <Typography sx={{ fontSize: 13, color: colors.interface.grey }}>
                      Distributor:{' '}
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
              header: 'Status',
              align: 'right',
              cell: (r) => (
                <StatusChip
                  label={r.isActive ? 'Active' : 'Deactivated'}
                  tone={r.isActive ? 'success' : 'neutral'}
                />
              ),
            },
            {
              id: 'generated',
              header: 'Generated',
              align: 'right',
              help: 'Promo codes generated for this campaign',
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
              id: 'newUsers',
              header: 'New Users',
              align: 'right',
              help: 'Customers whose first-ever activity in the workspace was a code from this campaign',
              cell: (r) => numberFmt.format(r.newUsers),
            },
          ]}
        />
      </Section>
      )}

      {(loading || users.length > 0) && (
      <Section title="Users">
        <Table<IntegrationListItem>
          rows={data?.users ?? []}
          getRowKey={(r) => r.id}
          loading={loading}
          onRowClick={(r) => navigate(`/users/${r.id}`)}
          emptyContent="No matching users"
          columns={[
            {
              id: 'name',
              header: 'Name',
              cell: (r) => (
                <Typography
                  sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}
                >
                  {r.name}
                </Typography>
              ),
            },
            {
              id: 'actions',
              header: 'Actions',
              align: 'right',
              help: 'All SDK calls through this integration (validate + redeem)',
              cell: (r) => numberFmt.format(r.actions),
            },
            {
              id: 'generated',
              header: 'Generated',
              align: 'right',
              help: 'Codes this integration generated itself (self-serve)',
              cell: (r) => numberFmt.format(r.generated),
            },
          ]}
        />
      </Section>
      )}
    </Box>
  );
};

export default SearchPage;
