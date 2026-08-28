import { type ReactNode } from 'react';
import { Box, Paper, Typography, type PaperProps } from '@mui/material';
import { colors, customShadows } from '../../theme';

export interface TableCardProps extends Omit<PaperProps, 'title'> {
  title?: ReactNode;
  /** Слот справа от заголовка — например `<StatusChip/>`. */
  meta?: ReactNode;
  /** Слот в правом краю шапки — например меню "…". */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Обёртка таблицы с шапкой из Figma (node 2671:70874): заголовок + чип статуса +
 * действия, ниже — таблица (передавай `<Table bare />`).
 */
export function TableCard({
  title,
  meta,
  actions,
  children,
  sx,
  ...rest
}: TableCardProps) {
  const hasHeader = title != null || meta != null || actions != null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: `1px solid ${colors.interface.grey3}`,
        boxShadow: customShadows.soft,
        overflow: 'hidden',
        bgcolor: colors.interface.white,
        ...sx,
      }}
      {...rest}
    >
      {hasHeader && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${colors.interface.grey3}`,
          }}
        >
          {title != null && (
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                lineHeight: '26px',
                color: colors.interface.black,
              }}
            >
              {title}
            </Typography>
          )}
          {meta}
          <Box sx={{ flex: 1 }} />
          {actions}
        </Box>
      )}
      {children}
    </Paper>
  );
}

export default TableCard;
