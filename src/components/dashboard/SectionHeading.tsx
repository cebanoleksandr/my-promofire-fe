import type { ReactNode } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('dashboard');
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
            {...(actionHref ? { component: RouterLink, to: actionHref } : {})}
            onClick={onActionClick}
            underline="hover"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: colors.brand.main,
              cursor: 'pointer',
            }}
          >
            {t('sectionHeading.seeAll')}
          </Link>
        ) : null)}
    </Box>
  );
}

export default SectionHeading;
