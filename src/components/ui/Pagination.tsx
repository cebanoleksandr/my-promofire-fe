import { Box, ButtonBase, type BoxProps } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { colors } from '../../theme';

export interface PaginationProps extends Omit<BoxProps, 'onChange'> {
  /** Текущая страница, 1-based. */
  page: number;
  /** Всего страниц. */
  count: number;
  onChange: (page: number) => void;
  /** Сколько соседних страниц показывать вокруг текущей. */
  siblingCount?: number;
  disabled?: boolean;
}

type Item = number | 'start-ellipsis' | 'end-ellipsis';

function buildRange(page: number, count: number, siblingCount: number): Item[] {
  const total = siblingCount * 2 + 5; // first + last + current + 2 siblings + 2 dots
  if (count <= total) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, count - 1);
  const items: Item[] = [1];

  if (left > 2) items.push('start-ellipsis');
  for (let i = left; i <= right; i += 1) items.push(i);
  if (right < count - 1) items.push('end-ellipsis');

  items.push(count);
  return items;
}

const CELL = 36;

/**
 * Пагинация в стиле проекта (radius 8, grey-3 рамки, active — чёрная заливка).
 * Стрелки + номера страниц с многоточиями по краям.
 */
export function Pagination({
  page,
  count,
  onChange,
  siblingCount = 1,
  disabled = false,
  sx,
  ...rest
}: PaginationProps) {
  if (count <= 1) return null;

  const items = buildRange(page, count, siblingCount);

  const go = (next: number) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(next, 1), count);
    if (clamped !== page) onChange(clamped);
  };

  const baseCell = {
    minWidth: CELL,
    height: CELL,
    px: 0.75,
    borderRadius: '8px',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1,
    fontFamily: 'inherit',
    transition: 'background-color .15s, color .15s, border-color .15s',
  };

  const arrow = (kind: 'prev' | 'next') => {
    const isDisabled = disabled || (kind === 'prev' ? page <= 1 : page >= count);
    return (
      <ButtonBase
        disableRipple
        aria-label={kind === 'prev' ? 'Previous page' : 'Next page'}
        disabled={isDisabled}
        onClick={() => go(kind === 'prev' ? page - 1 : page + 1)}
        sx={{
          ...baseCell,
          border: `1px solid ${colors.interface.grey3}`,
          color: colors.interface.black2,
          bgcolor: colors.interface.white,
          '&:hover': { bgcolor: colors.interface.grey4 },
          '&.Mui-disabled': {
            color: colors.interface.grey2,
            bgcolor: colors.interface.white,
            opacity: 0.5,
          },
          '& svg': { fontSize: 18 },
        }}
      >
        {kind === 'prev' ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
      </ButtonBase>
    );
  };

  return (
    <Box
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, ...sx }}
      {...rest}
    >
      {arrow('prev')}

      {items.map((item) => {
        if (item === 'start-ellipsis' || item === 'end-ellipsis') {
          return (
            <Box
              key={item}
              sx={{
                ...baseCell,
                display: 'inline-flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: colors.interface.grey2,
              }}
            >
              …
            </Box>
          );
        }

        const active = item === page;
        return (
          <ButtonBase
            key={item}
            disableRipple
            aria-current={active ? 'page' : undefined}
            disabled={disabled}
            onClick={() => go(item)}
            sx={{
              ...baseCell,
              border: `1px solid ${active ? colors.interface.black : colors.interface.grey3}`,
              color: active ? colors.interface.white : colors.interface.black2,
              bgcolor: active ? colors.interface.black : colors.interface.white,
              '&:hover': {
                bgcolor: active ? colors.interface.black : colors.interface.grey4,
              },
            }}
          >
            {item}
          </ButtonBase>
        );
      })}

      {arrow('next')}
    </Box>
  );
}

export default Pagination;
