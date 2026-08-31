import { Box, type BoxProps } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { StatsPeriod } from '../../types/stats';
import type { DateRangeParams } from '../../types/date-range';
import { DatePicker } from './DatePicker';
import { SegmentedControl } from './SegmentedControl';
import { IconButton } from './IconButton';

const presets: { value: StatsPeriod; label: string }[] = [
  { value: StatsPeriod.DAY, label: '1D' },
  { value: StatsPeriod.WEEK, label: '7D' },
  { value: StatsPeriod.MONTH, label: '1M' },
  { value: StatsPeriod.QUARTER, label: '3M' },
  { value: StatsPeriod.YEAR, label: 'Year' },
  { value: StatsPeriod.ALL, label: 'All' },
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
        <IconButton size={40} bordered aria-label="Refresh" onClick={onRefresh}>
          <RefreshRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default PeriodControl;
