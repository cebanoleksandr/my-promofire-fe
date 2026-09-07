import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TerminalIcon from '@mui/icons-material/Terminal';
import { useCreateIntegration, useDeleteIntegration, useIntegrations } from '../network/hooks';
import { colors, customShadows, fontStyles } from '../theme';

const CODE_EXAMPLES = {
  install: 'npm install @my-promofire-io/sdk',
  usage: `import { PromofireClient } from '@my-promofire-io/sdk';

const promofire = new PromofireClient({
  apiKey: process.env.PROMOFIRE_API_KEY!,
});

// 1. Validate and reserve the code in the cart
const { redemptionId, discountValue, discountType } = await promofire.validate({
  code: 'SUMMER2026',
  externalCustomerId: 'user_123',
  country: 'UA',
});

// 2. Actually redeem it after successful payment
await promofire.redeem({ redemptionId });`,
};

const SettingsPage: React.FC = () => {
  const { t } = useTranslation('settings');
  const { data: integrations = [], isLoading } = useIntegrations();
  const createMutation = useCreateIntegration();
  const deleteMutation = useDeleteIntegration();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [integrationName, setIntegrationName] = useState('');
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState<'install' | 'usage' | null>(null);

  const handleCreate = () => {
    if (!integrationName.trim()) return;
    createMutation.mutate(
      { name: integrationName.trim() },
      {
        onSuccess: (data) => {
          setIntegrationName('');
          setIsCreateOpen(false);
          setNewApiKey(data.apiKey);
        },
      },
    );
  };

  const handleCopy = (text: string, type?: 'install' | 'usage') => {
    navigator.clipboard.writeText(text);
    if (type) {
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <Box sx={{ maxWidth: 1120, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography sx={{ ...fontStyles.xl, color: colors.interface.black }}>
          {t('header.title')}
        </Typography>
        <Typography sx={{ ...fontStyles.mR, color: colors.interface.grey }}>
          {t('header.subtitle')}
        </Typography>
      </Stack>

      <Stack spacing={4}>
        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            backgroundColor: colors.interface.white,
            boxShadow: customShadows.soft,
            border: `1px solid ${colors.interface.grey3}`,
          }}
        >
          <Stack
            spacing={2}
            sx={{ 
              mb: 3, 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' } 
            }}
          >
            <Box>
              <Typography sx={{ ...fontStyles.l, color: colors.interface.black }}>
                {t('apiKeys.title')}
              </Typography>
              <Typography sx={{ ...fontStyles.smR, color: colors.interface.grey }}>
                {t('apiKeys.subtitle')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateOpen(true)}
              sx={{
                ...fontStyles.mM,
                backgroundColor: colors.brand.main,
                '&:hover': { backgroundColor: colors.brand.action },
                borderRadius: '8px',
                px: 2.5,
                py: 1,
              }}
            >
              {t('apiKeys.createKey')}
            </Button>
          </Stack>

          {isLoading ? (
            <Stack sx={{ alignItems: 'center', py: 4 }}>
              <CircularProgress size={32} sx={{ color: colors.brand.main }} />
            </Stack>
          ) : integrations.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: colors.interface.grey4,
                borderRadius: '8px',
              }}
            >
              <Typography sx={{ ...fontStyles.mR, color: colors.interface.grey }}>
                {t('apiKeys.empty')}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${colors.interface.grey3}`, borderRadius: '8px' }}>
              <Table>
                <TableHead sx={{ backgroundColor: colors.interface.grey4 }}>
                  <TableRow>
                    <TableCell sx={{ ...fontStyles.smSB, color: colors.interface.black2 }}>{t('apiKeys.table.name')}</TableCell>
                    <TableCell sx={{ ...fontStyles.smSB, color: colors.interface.black2 }}>{t('apiKeys.table.keyPrefix')}</TableCell>
                    <TableCell sx={{ ...fontStyles.smSB, color: colors.interface.black2 }}>{t('apiKeys.table.operations')}</TableCell>
                    <TableCell sx={{ ...fontStyles.smSB, color: colors.interface.black2 }}>{t('apiKeys.table.generated')}</TableCell>
                    <TableCell sx={{ ...fontStyles.smSB, color: colors.interface.black2 }}>{t('apiKeys.table.created')}</TableCell>
                    <TableCell align="right" sx={{ ...fontStyles.smSB, color: colors.interface.black2 }}>{t('apiKeys.table.action')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {integrations.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ ...fontStyles.smSB, color: colors.interface.black }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ ...fontStyles.smR, fontFamily: 'monospace', color: colors.interface.black2 }}>
                        {item.apiKeyPrefix}••••••••
                      </TableCell>
                      <TableCell sx={{ ...fontStyles.smR, color: colors.interface.grey }}>
                        {item.actions ?? 0}
                      </TableCell>
                      <TableCell sx={{ ...fontStyles.smR, color: colors.interface.grey }}>
                        {item.generated ?? 0}
                      </TableCell>
                      <TableCell sx={{ ...fontStyles.smR, color: colors.interface.grey }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('apiKeys.deleteKey')}>
                          <IconButton
                            size="small"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                            sx={{ color: colors.interface.grey, '&:hover': { color: colors.supportive.red } }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        <Card
          sx={{
            p: 3,
            borderRadius: '16px',
            backgroundColor: colors.interface.white,
            boxShadow: customShadows.soft,
            border: `1px solid ${colors.interface.grey3}`,
          }}
        >
          <Typography sx={{ ...fontStyles.l, color: colors.interface.black, mb: 1 }}>
            {t('sdk.title')}
          </Typography>
          <Typography sx={{ ...fontStyles.mR, color: colors.interface.grey, mb: 3 }}>
            {t('sdk.subtitle')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 2,
              mb: 3,
              borderRadius: '8px',
              backgroundColor: colors.supportive.red10,
              border: `1px solid ${colors.supportive.redAction}`,
            }}
          >
            <WarningAmberIcon sx={{ color: colors.supportive.red, mt: 0.2 }} />
            <Box>
              <Typography sx={{ ...fontStyles.smSB, color: colors.supportive.red }}>
                {t('sdk.securityWarning.title')}
              </Typography>
              <Typography sx={{ ...fontStyles.smR, color: colors.interface.black2 }}>
                {t('sdk.securityWarning.usePrefix')} <strong>{t('sdk.securityWarning.useBold')}</strong> {t('sdk.securityWarning.useSuffix')}{' '}
                {t('sdk.securityWarning.neverPrefix')} <code>apiKey</code> {t('sdk.securityWarning.neverSuffix')}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Typography sx={{ ...fontStyles.mSB, color: colors.interface.black }}>
              {t('sdk.step1')}
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                backgroundColor: colors.interface.black,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
                <TerminalIcon sx={{ color: colors.interface.grey2, fontSize: 18 }} />
                <Typography sx={{ ...fontStyles.smR, color: colors.interface.white, fontFamily: 'monospace' }}>
                  {CODE_EXAMPLES.install}
                </Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => handleCopy(CODE_EXAMPLES.install, 'install')}
                sx={{ color: colors.interface.grey2, '&:hover': { color: colors.interface.white } }}
              >
                {copiedCode === 'install' ? <CheckIcon fontSize="small" sx={{ color: colors.supportive.green }} /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Paper>
          </Stack>

          <Stack spacing={1.5}>
            <Typography sx={{ ...fontStyles.mSB, color: colors.interface.black }}>
              {t('sdk.step2')}
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.interface.black,
                borderRadius: '8px',
                position: 'relative',
              }}
            >
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(CODE_EXAMPLES.usage, 'usage')}
                  sx={{ color: colors.interface.grey2, '&:hover': { color: colors.interface.white } }}
                >
                  {copiedCode === 'usage' ? <CheckIcon fontSize="small" sx={{ color: colors.supportive.green }} /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Box>
              <Typography
                component="pre"
                sx={{
                  ...fontStyles.smR,
                  color: colors.interface.grey4,
                  fontFamily: 'monospace',
                  m: 0,
                  overflowX: 'auto',
                }}
              >
                {CODE_EXAMPLES.usage}
              </Typography>
            </Paper>
          </Stack>
        </Card>
      </Stack>

      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ ...fontStyles.l, color: colors.interface.black }}>
          {t('createDialog.title')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ ...fontStyles.smR, color: colors.interface.grey, mb: 2 }}>
            {t('createDialog.description')}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label={t('createDialog.nameLabel')}
            value={integrationName}
            onChange={(e) => setIntegrationName(e.target.value)}
            disabled={createMutation.isPending}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsCreateOpen(false)}
            sx={{ ...fontStyles.mM, color: colors.interface.grey }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!integrationName.trim() || createMutation.isPending}
            sx={{
              ...fontStyles.mM,
              backgroundColor: colors.brand.main,
              '&:hover': { backgroundColor: colors.brand.action },
            }}
          >
            {createMutation.isPending ? t('createDialog.creating') : t('createDialog.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(newApiKey)}
        onClose={() => setNewApiKey(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ ...fontStyles.l, color: colors.interface.black }}>
          {t('apiKeyDialog.title')}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: '8px',
              backgroundColor: colors.supportive.red10,
              border: `1px solid ${colors.supportive.redAction}`,
            }}
          >
            <Typography sx={{ ...fontStyles.smSB, color: colors.supportive.red }}>
              {t('apiKeyDialog.warningTitle')}
            </Typography>
            <Typography sx={{ ...fontStyles.smR, color: colors.interface.black2 }}>
              {t('apiKeyDialog.warningDescription')}
            </Typography>
          </Box>

          <TextField
            fullWidth
            size="small"
            value={newApiKey ?? ''}
            slotProps={{
              input: {
                readOnly: true,
                sx: { ...fontStyles.smR, fontFamily: 'monospace' },
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => newApiKey && handleCopy(newApiKey)}
                      startIcon={copiedKey ? <CheckIcon sx={{ color: colors.supportive.green }} /> : <ContentCopyIcon />}
                      size="small"
                      sx={{ ...fontStyles.sM, color: copiedKey ? colors.supportive.green : colors.brand.main }}
                    >
                      {copiedKey ? t('common.copied') : t('common.copy')}
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setNewApiKey(null)}
            sx={{
              ...fontStyles.mM,
              backgroundColor: colors.brand.main,
              '&:hover': { backgroundColor: colors.brand.action },
            }}
          >
            {t('apiKeyDialog.confirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
