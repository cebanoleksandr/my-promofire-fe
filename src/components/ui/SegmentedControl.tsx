import { Box, ButtonBase, type BoxProps } from '@mui/material';
import { colors, customShadows } from '../../theme';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string>
  extends Omit<BoxProps, 'onChange'> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'md' | 'xs';
}

/**
 * Переключатель диапазона из Figma (node 267:8005 "Chimps-md" /
 * 3948:75066 "chimp-xs"): 1D · 7D · 1M · 3M · Year · All.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  sx,
  ...rest
}: SegmentedControlProps<T>) {
  const h = size === 'md' ? 42 : 30;
  const fontSize = size === 'md' ? 14 : 12;

  return (
    <Box
      role="tablist"
      sx={{
        display: 'inline-flex',
        p: '3px',
        gap: '2px',
        borderRadius: '8px',
        bgcolor: colors.interface.grey4,
        border: `1px solid ${colors.interface.grey3}`,
        ...sx,
      }}
      {...rest}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <ButtonBase
            key={opt.value}
            role="tab"
            aria-selected={active}
            disableRipple
            onClick={() => onChange(opt.value)}
            sx={{
              minWidth: h,
              height: h - 6,
              px: 1.25,
              borderRadius: '6px',
              fontSize,
              fontWeight: 500,
              lineHeight: 1,
              transition: 'background-color .15s, color .15s',
              color: active ? colors.interface.black : colors.interface.grey,
              bgcolor: active ? colors.interface.white : 'transparent',
              boxShadow: active ? customShadows.soft : 'none',
              '&:hover': {
                color: colors.interface.black,
                bgcolor: active ? colors.interface.white : 'transparent',
              },
            }}
          >
            {opt.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default SegmentedControl;
