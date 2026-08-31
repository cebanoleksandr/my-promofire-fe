import { useState, type MouseEvent } from 'react';
import { Popover } from '@mui/material';
import { DateRangeField, type DateRangeFieldProps } from './DateRangeField';
import { DateRangePickerPanel, type DateRange } from './DateRangePickerPanel';

export interface DatePickerProps
  extends Omit<
    DateRangeFieldProps,
    'from' | 'to' | 'active' | 'onClick' | 'onChange' | 'value'
  > {
  /** Текущий период, ISO yyyy-mm-dd. */
  value?: Partial<DateRange>;
  onChange: (range: DateRange) => void;
}

/**
 * Пилюля периода с выпадающим выбором дат начала/конца.
 * Триггер — DateRangeField, дропдаун — DateRangePickerPanel.
 */
export function DatePicker({ value, onChange, ...fieldProps }: DatePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <DateRangeField
        {...fieldProps}
        from={value?.from}
        to={value?.to}
        active={open}
        onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { mt: 1, bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' },
          },
        }}
      >
        <DateRangePickerPanel
          value={value}
          onApply={(range) => {
            onChange(range);
            setAnchorEl(null);
          }}
          onCancel={() => setAnchorEl(null)}
        />
      </Popover>
    </>
  );
}

export default DatePicker;
