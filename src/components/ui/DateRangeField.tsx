import { forwardRef } from 'react';
import { ButtonBase, type ButtonBaseProps } from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { colors } from '../../theme';
import { DateLabel } from './DateLabel';

export interface DateRangeFieldProps extends Omit<ButtonBaseProps, 'children'> {
  from?: Date | string | number;
  to?: Date | string | number;
  placeholder?: string;
  active?: boolean;
  locale?: string;
}

/**
 * Триггер выбора периода из Figma (node 3554:88043 / 267:7815 → "calendar",
 * состояния Default / Active). border grey-3, radius 8, height 42.
 */
export const DateRangeField = forwardRef<HTMLButtonElement, DateRangeFieldProps>(
  function DateRangeField(
    { from, to, placeholder = 'Select period', active = false, locale, sx, ...rest },
    ref,
  ) {
    const hasValue = from != null;
    return (
      <ButtonBase
        ref={ref}
        disableRipple
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          minHeight: 42,
          px: 1.5,
          borderRadius: '8px',
          bgcolor: colors.interface.white,
          border: `1px solid ${active ? colors.brand.main : colors.interface.grey3}`,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '22px',
          color: hasValue ? colors.interface.black2 : colors.interface.grey,
          transition: 'border-color .15s',
          '&:hover': { borderColor: colors.interface.grey2 },
          ...sx,
        }}
        {...rest}
      >
        {hasValue ? (
          <DateLabel from={from!} to={to} locale={locale} />
        ) : (
          <>
            <CalendarTodayRoundedIcon
              sx={{ fontSize: 16, color: colors.interface.grey }}
            />
            {placeholder}
          </>
        )}
      </ButtonBase>
    );
  },
);

export default DateRangeField;
