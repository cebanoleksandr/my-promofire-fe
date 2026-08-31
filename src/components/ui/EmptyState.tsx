import type { ReactNode } from 'react';
import { Box, Typography, type BoxProps } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { colors } from '../../theme';

export interface EmptyStateProps extends Omit<BoxProps, 'title'> {
  title: string;
  description?: ReactNode;
  /** Иллюстрация/иконка; по умолчанию — нейтральная иконка. */
  icon?: ReactNode;
  /** Кнопка(и) действия. */
  action?: ReactNode;
  /** Компактный вид — для пустых таблиц/карточек. */
  dense?: boolean;
}

/**
 * Пустое состояние: иконка, заголовок, описание и опциональное действие.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  dense = false,
  sx,
  ...rest
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: dense ? 4 : 8,
        px: 3,
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          width: dense ? 48 : 64,
          height: dense ? 48 : 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.interface.grey4,
          color: colors.interface.grey2,
          '& svg': { fontSize: dense ? 24 : 32 },
        }}
      >
        {icon ?? <InboxRoundedIcon />}
      </Box>

      <Typography
        sx={{
          fontSize: dense ? 16 : 20,
          fontWeight: 600,
          lineHeight: dense ? '24px' : '28px',
          color: colors.interface.black,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            maxWidth: 380,
            fontSize: 14,
            lineHeight: '22px',
            color: colors.interface.grey,
          }}
        >
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
}

export default EmptyState;
