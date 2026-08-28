import { forwardRef } from 'react';
import {
  ButtonBase,
  CircularProgress,
  type ButtonBaseProps,
} from '@mui/material';
import { colors } from '../../theme';

export type AppButtonVariant =
  | 'main' // Button=L-main / M-red-less — заливка бренд-цветом
  | 'second' // Button=M-second — мягкая серая заливка
  | 'white' // Button=L-white — белая с рамкой
  | 'red' // Button=L-red / M-red — заливка красным
  | 'redGhost'; // "Leave page" / "Disable" — текстовая красная

export type AppButtonSize = 'L' | 'M' | 'XS';

export interface AppButtonProps extends Omit<ButtonBaseProps, 'children'> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const sizeStyles: Record<AppButtonSize, object> = {
  L: { minHeight: 46, px: 3, py: 1.25, fontSize: 16, lineHeight: '26px' },
  M: { minHeight: 42, px: 2, py: 1, fontSize: 14, lineHeight: '22px' },
  XS: { minHeight: 30, px: 1.25, py: 0.5, fontSize: 12, lineHeight: '18px' },
};

const variantStyles: Record<AppButtonVariant, object> = {
  main: {
    bgcolor: colors.brand.main,
    color: colors.interface.white,
    '&:hover': { bgcolor: colors.brand.action },
  },
  second: {
    bgcolor: colors.interface.grey4,
    color: colors.interface.black2,
    '&:hover': { bgcolor: colors.interface.grey3 },
  },
  white: {
    bgcolor: colors.interface.white,
    color: colors.interface.black2,
    border: `1px solid ${colors.interface.grey3}`,
    '&:hover': { bgcolor: colors.interface.grey4 },
  },
  red: {
    bgcolor: colors.supportive.red,
    color: colors.interface.white,
    '&:hover': { bgcolor: '#c23222' },
  },
  redGhost: {
    bgcolor: 'transparent',
    color: colors.supportive.red,
    '&:hover': { bgcolor: colors.supportive.red10 },
  },
};

/**
 * Кнопка из Figma (node 342:13074 → "Button"). radius 8, текст 16/500 (L).
 */
export const Button = forwardRef<HTMLButtonElement, AppButtonProps>(function Button(
  {
    variant = 'main',
    size = 'L',
    loading = false,
    disabled,
    startIcon,
    endIcon,
    fullWidth,
    children,
    sx,
    ...rest
  },
  ref,
) {
  return (
    <ButtonBase
      ref={ref}
      disabled={disabled || loading}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        borderRadius: '8px',
        fontWeight: 500,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        transition: 'background-color .15s, opacity .15s',
        width: fullWidth ? '100%' : 'auto',
        '&.Mui-disabled': { opacity: 0.5 },
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...sx,
      }}
      {...rest}
    >
      {loading ? (
        <CircularProgress size={size === 'L' ? 18 : 14} color="inherit" />
      ) : (
        <>
          {startIcon}
          {children}
          {endIcon}
        </>
      )}
    </ButtonBase>
  );
});

export default Button;
