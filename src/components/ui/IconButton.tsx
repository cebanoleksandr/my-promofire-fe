import { forwardRef } from 'react';
import { IconButton as MuiIconButton, type IconButtonProps } from '@mui/material';
import { colors } from '../../theme';

export interface AppIconButtonProps extends Omit<IconButtonProps, 'size'> {
  /** 40 — L-more / Search; 24 — M-more. */
  size?: 40 | 24;
  active?: boolean;
  bordered?: boolean;
}

/**
 * Квадратная иконочная кнопка из Figma (node 2009:8735 → "Buttons-dublicate":
 * L-more / Search / M-more, + active-состояния). radius 8.
 */
export const IconButton = forwardRef<HTMLButtonElement, AppIconButtonProps>(
  function IconButton(
    { size = 40, active = false, bordered = false, sx, ...rest },
    ref,
  ) {
    const inner = size === 40 ? 20 : 16;
    return (
      <MuiIconButton
        ref={ref}
        disableRipple
        sx={{
          width: size,
          height: size,
          borderRadius: '8px',
          p: 0,
          color: active ? colors.interface.black : colors.interface.grey,
          bgcolor: active ? colors.interface.grey4 : 'transparent',
          border: bordered ? `1px solid ${colors.interface.grey3}` : 'none',
          '&:hover': { bgcolor: colors.interface.grey4 },
          '& svg': { fontSize: inner },
          ...sx,
        }}
        {...rest}
      />
    );
  },
);

export default IconButton;
