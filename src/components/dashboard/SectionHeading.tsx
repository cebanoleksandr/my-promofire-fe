import type { ReactNode } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { colors } from '../../theme';

export interface SectionHeadingProps {
  title: string;
  /** Правый слот — обычно ссылка «See all». */
  action?: ReactNode;
  actionHref?: string;
  onActionClick?: () => void;
}

export function SectionHeading({
  title,
  action,
  actionHref,
  onActionClick,
}: SectionHeadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        mb: 2,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>
        {title}
      </Typography>

      {action ??
        (actionHref || onActionClick ? (
          <Link
            href={actionHref}
            onClick={onActionClick}
            underline="hover"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: colors.brand.main,
              cursor: 'pointer',
            }}
          >
            See all
          </Link>
        ) : null)}
    </Box>
  );
}

export default SectionHeading;
