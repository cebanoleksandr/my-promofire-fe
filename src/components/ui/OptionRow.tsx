import { Box, Checkbox, Radio, Typography, type BoxProps } from '@mui/material';
import { colors } from '../../theme';

export interface OptionRowProps extends Omit<BoxProps, 'onChange'> {
  label: string;
  /** Приглушённая подпись справа от лейбла (как "Just me" в макете). */
  hint?: string;
  control?: 'radio' | 'checkbox';
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * Строка выбора из Figma (node 285:10149 → "Option": single / Multi /
 * Option-list / Option-list-hover).
 */
export function OptionRow({
  label,
  hint,
  control = 'radio',
  checked = false,
  disabled = false,
  onChange,
  sx,
  ...rest
}: OptionRowProps) {
  const Control = control === 'radio' ? Radio : Checkbox;

  return (
    <Box
      role="button"
      aria-disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.75,
        borderRadius: '12px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color .15s',
        '&:hover': { bgcolor: disabled ? 'transparent' : colors.interface.grey4 },
        ...sx,
      }}
      {...rest}
    >
      <Control
        checked={checked}
        disabled={disabled}
        disableRipple
        tabIndex={-1}
        sx={{ p: 0 }}
      />
      <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: '22px' }}>
        {label}
      </Typography>
      {hint && (
        <Typography
          sx={{ fontSize: 14, lineHeight: '22px', color: colors.interface.grey2 }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}

export default OptionRow;
