import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { colors } from '../../theme';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  /** disabled + иконка замка справа (Figma "Property 1=locked"). */
  locked?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Текстовое поле из Figma (node 2663:64567 "Input Frame" +
 * 275:6861 "Inputs": Default / Error / right icon / locked). height 42, radius 8.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      helperText,
      error = false,
      locked = false,
      disabled,
      startIcon,
      endIcon,
      fullWidth = true,
      id,
      style,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const isDisabled = disabled || locked;
    const borderColor = error
      ? colors.supportive.red
      : colors.interface.grey3;

    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto', ...style }}>
        {label && (
          <Box
            component="label"
            htmlFor={inputId}
            sx={{
              display: 'block',
              mb: 0.75,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '22px',
              color: colors.interface.black2,
            }}
          >
            {label}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 42,
            px: 1.5,
            borderRadius: '8px',
            bgcolor: isDisabled ? colors.interface.grey4 : colors.interface.white,
            border: `1px solid ${borderColor}`,
            transition: 'border-color .15s',
            '&:focus-within': {
              borderColor: error ? colors.supportive.red : colors.brand.main,
            },
            '& > svg': { fontSize: 18, color: colors.interface.grey, flexShrink: 0 },
          }}
        >
          {startIcon}
          <Box
            component="input"
            id={inputId}
            ref={ref}
            disabled={isDisabled}
            sx={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: '22px',
              color: colors.interface.black,
              '&::placeholder': { color: colors.interface.grey2 },
            }}
            {...rest}
          />
          {locked ? <LockOutlinedIcon /> : endIcon}
        </Box>

        {helperText && (
          <Box
            sx={{
              mt: 0.5,
              fontSize: 12,
              lineHeight: '16px',
              color: error ? colors.supportive.red : colors.interface.grey,
            }}
          >
            {helperText}
          </Box>
        )}
      </Box>
    );
  },
);

export default TextField;
