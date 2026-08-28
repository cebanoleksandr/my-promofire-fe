import { Box, type BoxProps } from '@mui/material';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { colors } from '../../theme';

export interface MetricDeltaProps extends Omit<BoxProps, 'children'> {
  /** Значение в процентах. `null` / `undefined` → состояние "no data". */
  value?: number | null;
  /** Скрыть знак "%" (если подставляешь свой формат). */
  hideUnit?: boolean;
}

/**
 * Индикатор изменения метрики из Figma (node 270:6338 → "%metric").
 * positive → зелёный ▲, negative → красный ▼, no data → серый прочерк.
 */
export function MetricDelta({ value, hideUnit, sx, ...rest }: MetricDeltaProps) {
  const noData = value == null || Number.isNaN(value);
  const positive = !noData && (value as number) >= 0;

  const color = noData
    ? colors.interface.grey
    : positive
      ? colors.supportive.green
      : colors.supportive.red;

  const Icon = positive ? ArrowDropUpRoundedIcon : ArrowDropDownRoundedIcon;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.25,
        color,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '22px',
        ...sx,
      }}
      {...rest}
    >
      {noData ? (
        '—'
      ) : (
        <>
          <Icon sx={{ fontSize: 20, m: '-4px' }} />
          {Math.abs(value as number)}
          {hideUnit ? '' : '%'}
        </>
      )}
    </Box>
  );
}

export default MetricDelta;
