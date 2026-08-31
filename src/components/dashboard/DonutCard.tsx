import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { colors, customShadows } from '../../theme';
import { donutPalette } from './chart';

export interface DonutItem {
  key: string;
  count: number;
  percentage: number;
}

export interface DonutCardProps {
  title: string;
  items: DonutItem[];
  loading?: boolean;
  /** Человекочитаемый лейбл для ключа (напр. код страны → название). */
  labelFor?: (key: string) => string;
}

/**
 * Донат-чарт с легендой (Figma "campaing-countries" / "campaing-devices").
 */
export function DonutCard({ title, items, loading = false, labelFor }: DonutCardProps) {
  const color = (i: number) => donutPalette[i % donutPalette.length];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${colors.interface.grey3}`,
        boxShadow: customShadows.soft,
        bgcolor: colors.interface.white,
      }}
    >
      <Box sx={{ position: 'relative', height: 200 }}>
        {loading ? (
          <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto' }} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="count"
                  nameKey="key"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {items.map((_, i) => (
                    <Cell key={i} fill={color(i)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="text" />
            ))
          : items.map((it, i) => (
              <Box
                key={it.key}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14 }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: color(i),
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: 14, flex: 1, minWidth: 0 }} noWrap>
                  {labelFor ? labelFor(it.key) : it.key}
                </Typography>
                <Typography sx={{ fontSize: 14, color: colors.interface.grey }}>
                  {it.count}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, width: 44, textAlign: 'right' }}>
                  {it.percentage}%
                </Typography>
              </Box>
            ))}
      </Box>
    </Paper>
  );
}

export default DonutCard;
