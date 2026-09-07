import { Box, type BoxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { StatsPeriod } from '../../types/stats';
import type { DateRangeParams } from '../../types/date-range';
import { DatePicker } from './DatePicker';
import { SegmentedControl } from './SegmentedControl';
import { IconButton } from './IconButton';

const presetKeys: { value: StatsPeriod; labelKey: string }[] = [
  { value: StatsPeriod.DAY, labelKey: 'periodControl.day' },
  { value: StatsPeriod.WEEK, labelKey: 'periodControl.week' },
  { value: StatsPeriod.MONTH, labelKey: 'periodControl.month' },
  { value: StatsPeriod.QUARTER, labelKey: 'periodControl.quarter' },
  { value: StatsPeriod.YEAR, labelKey: 'periodControl.year' },
  { value: StatsPeriod.ALL, labelKey: 'periodControl.all' },
];

export interface PeriodControlProps extends Omit<BoxProps, 'onChange'> {
  value: DateRangeParams;
  onChange: (params: DateRangeParams) => void;
  onRefresh?: () => void;
}

/**
 * Панель периода дашборда: выбор произвольного диапазона + пресеты + refresh.
 */
export function PeriodControl({
  value,
  onChange,
  onRefresh,
  sx,
  ...rest
}: PeriodControlProps) {
  const { t } = useTranslation('common');
  const presets = presetKeys.map(({ value: v, labelKey }) => ({
    value: v,
    label: t(labelKey),
  }));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }} {...rest}>
      <DatePicker
        value={
          value.period === StatsPeriod.CUSTOM
            ? { from: value.from, to: value.to }
            : undefined
        }
        onChange={({ from, to }) =>
          onChange({ period: StatsPeriod.CUSTOM, from, to })
        }
      />

      <SegmentedControl<StatsPeriod>
        options={presets}
        value={(value.period ?? '') as StatsPeriod}
        onChange={(period) => onChange({ period })}
      />

      {onRefresh && (
        <IconButton size={40} bordered aria-label={t('periodControl.refresh')} onClick={onRefresh}>
          <RefreshRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default PeriodControl;
