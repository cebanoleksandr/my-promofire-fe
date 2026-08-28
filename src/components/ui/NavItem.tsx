import type { ElementType, ReactNode } from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type ListItemButtonProps,
} from '@mui/material';
import { colors } from '../../theme';

export interface NavItemProps extends Omit<ListItemButtonProps, 'children'> {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  /** Полиморфный рендер — например `component={RouterLink} to="/codes"`. */
  component?: ElementType;
  to?: string;
}

/**
 * Пункт бокового меню из Figma (node 333:8526 → "page-name-main").
 * Distributors · Users · Analytics · Campaigns · Settings.
 */
export function NavItem({ label, icon, active = false, sx, ...rest }: NavItemProps) {
  return (
    <ListItemButton
      selected={active}
      sx={{
        gap: 1,
        px: 1.5,
        py: 1,
        borderRadius: '12px',
        color: colors.interface.grey,
        '& .MuiListItemIcon-root': { minWidth: 0, color: 'inherit' },
        '&:hover': { bgcolor: colors.interface.grey4 },
        '&.Mui-selected': {
          bgcolor: colors.interface.grey4,
          color: colors.interface.black,
          '&:hover': { bgcolor: colors.interface.grey4 },
        },
        ...sx,
      }}
      {...rest}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primary={label}
        slotProps={{
          primary: {
            sx: { fontSize: 16, fontWeight: active ? 600 : 500, lineHeight: '26px' },
          },
        }}
      />
    </ListItemButton>
  );
}

export default NavItem;
