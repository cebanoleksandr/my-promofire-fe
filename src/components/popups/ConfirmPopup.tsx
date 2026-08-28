import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme';
import { Button } from '../ui';
import BasePopup from './BasePopup';

export interface ConfirmPopupProps {
  isVisible: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` — красная кнопка подтверждения (удаление, выход и т.п.). */
  tone?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Универсальный поп-ап подтверждения поверх BasePopup.
 */
export function ConfirmPopup({
  isVisible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmPopupProps) {
  return (
    <BasePopup isVisible={isVisible} onClose={loading ? () => {} : onClose}>
      <Box sx={{ maxWidth: 420 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              mt: 1,
              fontSize: 14,
              lineHeight: '22px',
              color: colors.interface.grey,
            }}
          >
            {description}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="white" size="M" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'red' : 'main'}
            size="M"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default ConfirmPopup;
