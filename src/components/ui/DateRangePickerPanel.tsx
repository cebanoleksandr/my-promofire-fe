import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, type PaperProps } from '@mui/material';
import { colors, customShadows } from '../../theme';
import { Button } from './Button';

export interface DateRange {
  from: string; // ISO yyyy-mm-dd
  to: string;
}

export interface DateRangePickerPanelProps extends Omit<PaperProps, 'onChange'> {
  value?: Partial<DateRange>;
  onApply: (range: DateRange) => void;
  onCancel?: () => void;
}

const inputSx = {
  flex: 1,
  minWidth: 0,
  height: 42,
  px: 1.5,
  borderRadius: '8px',
  border: `1px solid ${colors.interface.grey3}`,
  fontFamily: 'inherit',
  fontSize: 14,
  color: colors.interface.black2,
  outline: 'none',
  '&:focus': { borderColor: colors.brand.main },
} as const;

/**
 * Панель выбора периода из Figma (node 2152:17133 → "Datepickers":
 * два поля даты + Cancel / Apply). Календарной сетки нет — используются
 * нативные input[type=date] (пакет @mui/x-date-pickers не установлен).
 */
export function DateRangePickerPanel({
  value,
  onApply,
  onCancel,
  sx,
  ...rest
}: DateRangePickerPanelProps) {
  const { t } = useTranslation('common');
  const [from, setFrom] = useState(value?.from ?? '');
  const [to, setTo] = useState(value?.to ?? '');
  const valid = from !== '' && to !== '' && from <= to;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: '12px',
        border: `1px solid ${colors.interface.grey3}`,
        boxShadow: customShadows.contour,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: { xs: 'min(88vw, 340px)', sm: 340 },
        ...sx,
      }}
      {...rest}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Box component="input" type="date" value={from} max={to || undefined}
          onChange={(e) => setFrom(e.target.value)} sx={{ ...inputSx, minWidth: 120 }} />
        <Box component="span" sx={{ color: colors.interface.grey, flexShrink: 0 }}>—</Box>
        <Box component="input" type="date" value={to} min={from || undefined}
          onChange={(e) => setTo(e.target.value)} sx={{ ...inputSx, minWidth: 120 }} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="white" size="M" onClick={onCancel}>
          {t('dateRangePickerPanel.cancel')}
        </Button>
        <Button
          variant="main"
          size="M"
          disabled={!valid}
          onClick={() => onApply({ from, to })}
        >
          {t('dateRangePickerPanel.apply')}
        </Button>
      </Box>
    </Paper>
  );
}

export default DateRangePickerPanel;
