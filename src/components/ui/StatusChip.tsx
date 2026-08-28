import { Box, type BoxProps } from '@mui/material';
import { colors } from '../../theme';

export type StatusTone = 'info' | 'success' | 'neutral' | 'error' | 'warning';

const toneStyles: Record<StatusTone, { bg: string; color: string }> = {
  info: { bg: colors.supportive.blue10, color: colors.supportive.blue },
  success: { bg: colors.supportive.green10, color: colors.supportive.green },
  neutral: { bg: colors.interface.grey4, color: colors.interface.grey },
  error: { bg: colors.supportive.red10, color: colors.supportive.red },
  warning: { bg: colors.supportive.red10, color: colors.supportive.redAction },
};

export interface StatusChipProps extends Omit<BoxProps, 'children'> {
  label: string;
  tone?: StatusTone;
}

/**
 * Пилюля статуса из Figma (node 2657:63027 → "status-*").
 * radius 24, padding 12/4, текст 14/500.
 */
export function StatusChip({ label, tone = 'neutral', sx, ...rest }: StatusChipProps) {
  const t = toneStyles[tone];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: '24px',
        bgcolor: t.bg,
        color: t.color,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '18px',
        whiteSpace: 'nowrap',
        ...sx,
      }}
      {...rest}
    >
      {label}
    </Box>
  );
}

export default StatusChip;
