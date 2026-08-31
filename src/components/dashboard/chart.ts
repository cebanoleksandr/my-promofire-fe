// Палитра дашборд-графиков (в дизайн-токенах фиксированных «серий» нет)
export const seriesColors = {
  generated: '#5E9B19',
  redeemed: '#7C6BF5',
  expired: '#D73B2A',
  active: '#5E9B19',
  new: '#7C6BF5',
  all: '#7A7B8D',
} as const;

// Категориальная палитра для донат-чартов (страны/устройства)
export const donutPalette = [
  '#7C6BF5',
  '#F5896C',
  '#5E9B19',
  '#2196F3',
  '#F5C542',
  '#EB6FB5',
  '#73B9F1',
  '#9AD16B',
  '#F1562D',
  '#B48CF0',
];

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    const n = value / 1000;
    return `${Number.isInteger(n) ? n : n.toFixed(1)}k`;
  }
  return String(value);
}

export function formatDayMonth(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}
