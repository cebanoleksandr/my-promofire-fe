import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { usePromoCode } from '../network/hooks';
import { Button, Table } from '../components/ui';
import { colors } from '../theme';
import type { PromoCodeIntegrationBreakdown } from '../types/promo-code';

const numberFmt = new Intl.NumberFormat('en-US');

const CodeUsers = () => {
  const { codeId } = useParams<{ codeId: string }>();
  const navigate = useNavigate();

  const code = usePromoCode(codeId);
  const c = code.data;

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
        <Typography>Code not found.</Typography>
        <Button sx={{ mt: 2 }} variant="white" onClick={() => navigate('/codes')}>
          Back to codes
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
          onClick={() => navigate('/codes')}
        >
          Code
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography
          sx={{ fontSize: 14, color: colors.interface.grey, cursor: 'pointer' }}
          onClick={() => navigate(`/codes/${c.id}`)}
        >
          {c.code}
        </Typography>
        <ChevronRightRoundedIcon sx={{ fontSize: 16, color: colors.interface.grey2 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          Users
        </Typography>
      </Box>

      <Table<PromoCodeIntegrationBreakdown>
        rows={c.integrations}
        getRowKey={(r) => r.integrationId}
        emptyContent="No activity yet"
        columns={[
          { id: 'name', header: 'Name', cell: (r) => r.name },
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
    </Box>
  );
};

export default CodeUsers;
