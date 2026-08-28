import { Box, type BoxProps } from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { colors } from '../../theme';

export interface DateLabelProps extends Omit<BoxProps, 'children'> {
  from: Date | string | number;
  /** Если задан — рендерится диапазон ("1—22 October, 2025"). */
  to?: Date | string | number;
  locale?: string;
  withIcon?: boolean;
}

/**
 * Подпись даты/периода из Figma (node 446:13618 → "Date": period / Date).
 */
export function DateLabel({
  from,
  to,
  locale = 'en-US',
  withIcon = true,
  sx,
  ...rest
}: DateLabelProps) {
  const start = new Date(from);
  const end = to != null ? new Date(to) : null;

  let text: string;
  if (!end) {
    // "22 Oct, 2025"
    text = start.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } else if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    // "1—22 October, 2025"
    const month = start.toLocaleDateString(locale, { month: 'long' });
    text = `${start.getDate()}—${end.getDate()} ${month}, ${end.getFullYear()}`;
  } else {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    text = `${start.toLocaleDateString(locale, opts)} — ${end.toLocaleDateString(
      locale,
      { ...opts, year: 'numeric' },
    )}`;
  }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '22px',
        color: colors.interface.black2,
        ...sx,
      }}
      {...rest}
    >
      {withIcon && (
        <CalendarTodayRoundedIcon
          sx={{ fontSize: 16, color: colors.interface.grey }}
        />
      )}
      {text}
    </Box>
  );
}

export default DateLabel;
