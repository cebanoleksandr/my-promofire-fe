import { useId } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { colors, customShadows } from '../../theme';
import { formatCompact, formatDayMonth } from './chart';

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
}

export interface TrendAreaChartProps<T = Record<string, unknown>> {
  data: readonly T[];
  xKey: keyof T & string;
  series: TrendSeries[];
  height?: number;
  loading?: boolean;
}

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: '8px',
        bgcolor: colors.interface.white,
        border: `1px solid ${colors.interface.grey3}`,
        boxShadow: customShadows.contour,
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>
        {formatDayMonth(String(label))}
      </Typography>
      {payload.map((p) => (
        <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }}
          />
          <Typography sx={{ fontSize: 12, color: colors.interface.grey }}>
            {p.name}:
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{p.value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/**
 * Стековый area-chart с градиентной заливкой (Figma "Statistic").
 */
export function TrendAreaChart<T>({
  data,
  xKey,
  series,
  height = 260,
  loading = false,
}: TrendAreaChartProps<T>) {
  const gradId = useId().replace(/:/g, '');

  if (loading) {
    return <Skeleton variant="rounded" height={height} />;
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data as unknown[]}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.key}
                id={`${gradId}-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            vertical={false}
            stroke={colors.interface.grey3}
            strokeDasharray="0"
          />
          <XAxis
            dataKey={xKey as string}
            tickFormatter={(v) => formatDayMonth(String(v))}
            tick={{ fontSize: 11, fill: colors.interface.grey }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            orientation="right"
            tickFormatter={(v) => formatCompact(Number(v))}
            tick={{ fontSize: 11, fill: colors.interface.grey }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: colors.interface.grey2, strokeDasharray: '4 4' }}
          />

          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stackId="1"
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#${gradId}-${s.key})`}
              activeDot={{ r: 3 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default TrendAreaChart;
