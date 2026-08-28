import { forwardRef } from 'react';
import { ButtonBase, type ButtonBaseProps } from '@mui/material';
import { colors } from '../../theme';

export interface SocialButtonProps extends Omit<ButtonBaseProps, 'children'> {
  /** Иконка провайдера (Google / Apple …). */
  icon?: React.ReactNode;
  label: string;
  /** `filled` — оранжевая (Sign up with custom email), `outline` — белая с рамкой. */
  emphasis?: 'outline' | 'filled';
}

/**
 * Широкая кнопка из Figma (node 3374:80620 → "Lg-button"):
 * Log in with Google / Apple / Sign up with custom email. height 46, radius 8.
 */
export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  function SocialButton({ icon, label, emphasis = 'outline', sx, ...rest }, ref) {
    const filled = emphasis === 'filled';
    return (
      <ButtonBase
        ref={ref}
        sx={{
          width: '100%',
          minHeight: 46,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          px: 2,
          borderRadius: '8px',
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '26px',
          transition: 'background-color .15s',
          bgcolor: filled ? colors.brand.main : colors.interface.white,
          color: filled ? colors.interface.white : colors.interface.black,
          border: filled ? 'none' : `1px solid ${colors.interface.grey3}`,
          '&:hover': {
            bgcolor: filled ? colors.brand.action : colors.interface.grey4,
          },
          ...sx,
        }}
        {...rest}
      >
        {icon && (
          <span style={{ display: 'inline-flex', width: 20, height: 20 }}>
            {icon}
          </span>
        )}
        {label}
      </ButtonBase>
    );
  },
);

export default SocialButton;
