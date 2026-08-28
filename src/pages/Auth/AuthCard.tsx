import type { ReactNode } from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';
import { colors, customShadows } from '../../theme';

export interface AuthCardProps {
  title: string;
  subtitle?: ReactNode;
  /** Текст ошибки от API (ApiError.message). */
  error?: string | null;
  onSubmit: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Карточка-обёртка для форм авторизации (используется на страницах
 * логина и регистрации внутри пустого AuthLayout).
 */
export function AuthCard({
  title,
  subtitle,
  error,
  onSubmit,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: '16px',
        border: `1px solid ${colors.interface.grey3}`,
        boxShadow: customShadows.soft,
        bgcolor: colors.interface.white,
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{ mt: 1, fontSize: 14, lineHeight: '22px', color: colors.interface.grey }}
        >
          {subtitle}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {children}
      </Box>

      {footer && (
        <Box
          sx={{
            mt: 3,
            textAlign: 'center',
            fontSize: 14,
            color: colors.interface.grey,
          }}
        >
          {footer}
        </Box>
      )}
    </Paper>
  );
}

export default AuthCard;
