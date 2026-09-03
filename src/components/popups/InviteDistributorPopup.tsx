import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { colors } from '../../theme';
import { Button, IconButton, TextField } from '../ui';
import BasePopup from './BasePopup';

export interface InviteDistributorPopupProps {
  isVisible: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onInvite: (email: string) => void;
}

/**
 * Поп-ап приглашения дистрибьютора поверх BasePopup — вызывается кнопкой
 * "Invite distributor" на DistributorsPage.
 */
export function InviteDistributorPopup({
  isVisible,
  loading = false,
  error,
  onClose,
  onInvite,
}: InviteDistributorPopupProps) {
  const [email, setEmail] = useState('');

  const handleClose = () => {
    if (loading) return;
    onClose();
    setEmail('');
  };

  const trimmed = email.trim();

  const handleInvite = () => {
    if (!trimmed) return;
    onInvite(trimmed);
  };

  return (
    <BasePopup isVisible={isVisible} onClose={handleClose}>
      <Box sx={{ width: '100%', minWidth: 380 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>
            Invite distributor
          </Typography>
          <IconButton size={24} aria-label="Close" onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Typography sx={{ mt: 1, fontSize: 14, lineHeight: '22px', color: colors.interface.grey }}>
          We'll send an invite link to this email so they can join as a distributor.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="distributor@company.com"
            value={email}
            error={!!error}
            helperText={error ?? undefined}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
          <Button variant="white" fullWidth disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button fullWidth loading={loading} disabled={!trimmed} onClick={handleInvite}>
            Send invite
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default InviteDistributorPopup;
