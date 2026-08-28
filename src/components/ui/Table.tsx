import { type ReactNode } from 'react';
import {
  Box,
  Skeleton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  type TableProps as MuiTableProps,
} from '@mui/material';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { colors, customShadows } from '../../theme';

export type SortDirection = 'asc' | 'desc';
export interface TableSort {
  columnId: string;
  direction: SortDirection;
}

export interface Column<Row> {
  id: string;
  header: ReactNode;
  /** Содержимое ячейки строки. */
  cell: (row: Row, rowIndex: number) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  sortable?: boolean;
  /** Текст подсказки — рисует иконку "?" рядом с заголовком. */
  help?: ReactNode;
}

export interface TableProps<Row> extends Omit<MuiTableProps, 'children'> {
  columns: Column<Row>[];
  rows: Row[];
  getRowKey: (row: Row, index: number) => string | number;
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  onRowClick?: (row: Row, index: number) => void;
  isRowSelected?: (row: Row, index: number) => boolean;
  loading?: boolean;
  skeletonRows?: number;
  emptyContent?: ReactNode;
  stickyHeader?: boolean;
  /** Без собственной рамки/тени/скругления — когда таблица внутри `TableCard`. */
  bare?: boolean;
}

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction?: SortDirection;
}) {
  const on = colors.interface.black;
  const off = colors.interface.grey2;
  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 0, ml: 0.25 }}
    >
      <ArrowDropUpRoundedIcon
        sx={{
          fontSize: 14,
          m: '-3px',
          color: active && direction === 'asc' ? on : off,
        }}
      />
      <ArrowDropDownRoundedIcon
        sx={{
          fontSize: 14,
          m: '-3px',
          color: active && direction === 'desc' ? on : off,
        }}
      />
    </Box>
  );
}

/**
 * Универсальная таблица из Figma (node 2671:70874).
 * Хедер с сортировкой и подсказками, hover/selected строки, пустое состояние,
 * skeleton-загрузка. Рендерит любые данные через `columns[].cell`.
 */
export function Table<Row>({
  columns,
  rows,
  getRowKey,
  sort,
  onSortChange,
  onRowClick,
  isRowSelected,
  loading = false,
  skeletonRows = 5,
  emptyContent = 'Nothing yet',
  stickyHeader = false,
  bare = false,
  sx,
  ...rest
}: TableProps<Row>) {
  const clickable = Boolean(onRowClick);

  const handleSort = (col: Column<Row>) => {
    if (!col.sortable || !onSortChange) return;
    const isActive = sort?.columnId === col.id;
    const direction: SortDirection =
      isActive && sort?.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ columnId: col.id, direction });
  };

  return (
    <TableContainer
      sx={{
        borderRadius: bare ? 0 : '12px',
        border: bare ? 'none' : `1px solid ${colors.interface.grey3}`,
        boxShadow: bare ? 'none' : customShadows.soft,
        bgcolor: colors.interface.white,
      }}
    >
      <MuiTable stickyHeader={stickyHeader} sx={{ minWidth: 480, ...sx }} {...rest}>
        <TableHead>
          <TableRow>
            {columns.map((col) => {
              const isActive = sort?.columnId === col.id;
              return (
                <TableCell
                  key={col.id}
                  align={col.align ?? 'left'}
                  sx={{
                    width: col.width,
                    py: 1.5,
                    fontSize: 14,
                    fontWeight: 500,
                    color: colors.interface.grey,
                    bgcolor: colors.interface.white,
                    borderBottom: `1px solid ${colors.interface.grey3}`,
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    cursor: col.sortable ? 'pointer' : 'default',
                  }}
                  onClick={() => handleSort(col)}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      justifyContent:
                        col.align === 'right'
                          ? 'flex-end'
                          : col.align === 'center'
                            ? 'center'
                            : 'flex-start',
                    }}
                  >
                    {col.sortable && (
                      <SortIndicator active={isActive} direction={sort?.direction} />
                    )}
                    {col.header}
                    {col.help != null && (
                      <Tooltip title={col.help} arrow>
                        <HelpOutlineRoundedIcon
                          sx={{ fontSize: 15, color: colors.interface.grey2 }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading &&
            Array.from({ length: skeletonRows }).map((_, r) => (
              <TableRow key={`sk-${r}`}>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ py: 1.5, borderBottom: `1px solid ${colors.interface.grey3}` }}>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{
                  py: 5,
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  color: colors.interface.grey2,
                  borderBottom: 'none',
                }}
              >
                {emptyContent}
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            rows.map((row, index) => {
              const selected = isRowSelected?.(row, index) ?? false;
              return (
                <TableRow
                  key={getRowKey(row, index)}
                  hover={clickable}
                  selected={selected}
                  onClick={() => onRowClick?.(row, index)}
                  sx={{
                    cursor: clickable ? 'pointer' : 'default',
                    '&.Mui-selected, &.Mui-selected:hover': {
                      bgcolor: colors.interface.grey4,
                    },
                    '&:last-of-type td': { borderBottom: 'none' },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align ?? 'left'}
                      sx={{
                        py: 1.5,
                        fontSize: 14,
                        color: colors.interface.black,
                        borderBottom: `1px solid ${colors.interface.grey3}`,
                      }}
                    >
                      {col.cell(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
