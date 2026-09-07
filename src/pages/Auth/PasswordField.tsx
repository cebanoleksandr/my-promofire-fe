import { forwardRef, useState } from 'react';
import { IconButton } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme';
import { TextField, type TextFieldProps } from '../../components/ui';

/**
 * Поле пароля с переключателем видимости. Ref пробрасывается в input
 * (нужно для react-hook-form `register`).
 */
export const PasswordField = forwardRef<HTMLInputElement, TextFieldProps>(
  function PasswordField(props, ref) {
    const { t } = useTranslation('auth');
    const [visible, setVisible] = useState(false);
    return (
      <TextField
        ref={ref}
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        endIcon={
          <IconButton
            type="button"
            aria-label={visible ? t('passwordField.hide') : t('passwordField.show')}
            onClick={() => setVisible((v) => !v)}
            sx={{ p: 0.25, color: colors.interface.grey }}
          >
            {visible ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        }
        {...props}
      />
    );
  },
);

export default PasswordField;
