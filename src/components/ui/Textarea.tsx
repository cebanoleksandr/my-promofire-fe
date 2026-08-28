import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { colors } from '../../theme';

export type TextareaStatus = 'default' | 'creating' | 'locked';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  /** Figma: payload-default / payload-Creating / payload-locked. */
  status?: TextareaStatus;
  minRows?: number;
  fullWidth?: boolean;
}

/**
 * Многострочное поле (payload / note) из Figma (node 316:12472 → "Inputs":
 * payload-* / note-*). radius 8, бордер grey-3.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      helperText,
      error = false,
      status = 'default',
      minRows = 4,
      fullWidth = true,
      disabled,
      id,
      style,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const locked = status === 'locked';
    const isDisabled = disabled || locked;
    const borderColor = error
      ? colors.supportive.red
      : status === 'creating'
        ? colors.brand.main
        : colors.interface.grey3;

    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto', ...style }}>
        {label && (
          <Box
            component="label"
            htmlFor={fieldId}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 0.75,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '22px',
              color: colors.interface.black2,
            }}
          >
            {label}
            {locked && (
              <LockOutlinedIcon sx={{ fontSize: 14, color: colors.interface.grey }} />
            )}
          </Box>
        )}

        <Box
          component="textarea"
          id={fieldId}
          ref={ref}
          rows={minRows}
          disabled={isDisabled}
          sx={{
            display: 'block',
            width: '100%',
            resize: 'vertical',
            p: 1.5,
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            bgcolor: isDisabled ? colors.interface.grey4 : colors.interface.white,
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: '22px',
            color: colors.interface.black,
            outline: 'none',
            transition: 'border-color .15s',
            '&:focus': {
              borderColor: error ? colors.supportive.red : colors.brand.main,
            },
            '&::placeholder': { color: colors.interface.grey2 },
          }}
          {...rest}
        />

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

export default Textarea;
