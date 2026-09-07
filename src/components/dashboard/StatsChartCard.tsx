import type { ReactNode } from 'react';
import { Box, Divider, Paper } from '@mui/material';
import { colors, customShadows } from '../../theme';
import { StatTile, type StatTileProps } from './StatTile';

export interface StatsChartCardProps {
  tiles: StatTileProps[];
  chart: ReactNode;
}

/**
 * Карточка секции статистики: ряд KPI-плиток + график под ними
 * (Figma "Statistic").
 */
export function StatsChartCard({ tiles, chart }: StatsChartCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: '12px',
        border: `1px solid ${colors.interface.grey3}`,
        boxShadow: customShadows.soft,
        bgcolor: colors.interface.white,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {tiles.map((t, i) => (
          <Box
            key={t.label}
            sx={{
              flex: { xs: '1 1 calc(50% - 8px)', sm: 1 },
              display: 'flex',
              gap: { xs: 2, sm: 3 },
              minWidth: 0,
            }}
          >
            {i > 0 && (
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <StatTile {...t} />
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, width: '100%', overflow: 'hidden' }}>{chart}</Box>
    </Paper>
  );
}

export default StatsChartCard;
