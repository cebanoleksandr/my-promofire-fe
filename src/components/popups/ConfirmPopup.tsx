import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
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
  confirmLabel,
  cancelLabel,
  tone = 'default',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmPopupProps) {
  const { t } = useTranslation('popups');
  const resolvedConfirmLabel = confirmLabel ?? t('confirmPopup.confirm');
  const resolvedCancelLabel = cancelLabel ?? t('confirmPopup.cancel');
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
            {resolvedCancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'red' : 'main'}
            size="M"
            loading={loading}
            onClick={onConfirm}
          >
            {resolvedConfirmLabel}
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default ConfirmPopup;
