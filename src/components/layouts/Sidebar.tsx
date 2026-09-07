import type { ReactNode } from 'react';
import { Link as RouterLink, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, List } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { colors } from '../../theme';
import { NavItem } from '../ui';
import { LogoutNavItem } from './LogoutNavItem';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { useCurrentWorkspace } from '../../network/hooks';
import { Role } from '../../types/membership';

export const SIDEBAR_WIDTH = 260;

interface NavLinkDef {
  to: string;
  labelKey: string;
  icon: ReactNode;
  /** Точное совпадение пути (для "/"). */
  end?: boolean;
  /** Роли, которым эта ссылка не показывается. */
  hideFor?: Role[];
  /** data-discovery-target — якорь для тултипов онбординга. */
  discoveryTarget?: string;
}

const mainLinks: NavLinkDef[] = [
  {
    to: '/',
    labelKey: 'sidebar.home',
    icon: <HomeOutlinedIcon />,
    end: true,
    discoveryTarget: 'nav-home',
  },
  {
    to: '/campaigns',
    labelKey: 'sidebar.campaigns',
    icon: <CampaignOutlinedIcon />,
    discoveryTarget: 'nav-campaigns',
  },
  {
    to: '/codes',
    labelKey: 'sidebar.codes',
    icon: <ConfirmationNumberOutlinedIcon />,
    discoveryTarget: 'nav-codes',
  },
  {
    to: '/distributors',
    labelKey: 'sidebar.distributors',
    icon: <StorefrontOutlinedIcon />,
    hideFor: [Role.DISTRIBUTOR],
    discoveryTarget: 'nav-distributors',
  },
  {
    to: '/users',
    labelKey: 'sidebar.users',
    icon: <GroupOutlinedIcon />,
    hideFor: [Role.DISTRIBUTOR],
    discoveryTarget: 'nav-users',
  },
];

function SidebarLink({ to, labelKey, icon, end, discoveryTarget }: NavLinkDef) {
  const { t } = useTranslation('layout');
  const match = useMatch({ path: to, end: end ?? false });
  return (
    <NavItem
      component={RouterLink}
      to={to}
      label={t(labelKey)}
      icon={icon}
      active={Boolean(match)}
      data-discovery-target={discoveryTarget}
    />
  );
}

export function Sidebar() {
  const workspace = useCurrentWorkspace();
  const role = workspace.data?.role;
  const links = mainLinks.filter((link) => !role || !link.hideFor?.includes(role));

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5,
        bgcolor: colors.interface.white,
        borderRight: `1px solid ${colors.interface.grey3}`,
      }}
    >
      <WorkspaceSwitcher />

      <List disablePadding sx={{ flex: 1, mt: 1, '& > * + *': { mt: 0.5 } }}>
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </List>

      <List disablePadding sx={{ flexShrink: 0, '& > * + *': { mt: 0.5 } }}>
        <SidebarLink
          to="/settings"
          labelKey="sidebar.settings"
          icon={<SettingsOutlinedIcon />}
          discoveryTarget="nav-settings"
        />
        <LogoutNavItem />
      </List>
    </Box>
  );
}

export default Sidebar;
