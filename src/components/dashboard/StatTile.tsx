import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { colors } from '../../theme';
import { MetricDelta } from '../ui';

export interface StatTileProps {
  label: string;
  value: number | string;
  changePct?: number | null;
  /** Цвет точки-маркера серии. */
  color?: string;
  help?: string;
  loading?: boolean;
}

/**
 * KPI-плитка над графиком (Figma "Statistic": Generated / Redeemed / Expired).
 */
export function StatTile({
  label,
  value,
  changePct,
  color,
  help,
  loading = false,
}: StatTileProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {color && (
          <Box
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
          />
        )}
        <Typography sx={{ fontSize: 14, color: colors.interface.grey }}>
          {label}
        </Typography>
        {help && (
          <Tooltip title={help} arrow>
            <HelpOutlineRoundedIcon
              sx={{ fontSize: 15, color: colors.interface.grey2 }}
            />
          </Tooltip>
        )}
      </Box>

      {loading ? (
        <Skeleton variant="text" width={90} sx={{ fontSize: 28 }} />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: '36px' }}>
            {value}
          </Typography>
          {changePct != null && <MetricDelta value={changePct} />}
        </Box>
      )}
    </Box>
  );
}

export default StatTile;
