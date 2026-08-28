import type { ReactNode } from 'react';
import { Link as RouterLink, useMatch } from 'react-router-dom';
import { Box, List } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { colors } from '../../theme';
import { NavItem, WorkspaceItem } from '../ui';
import { LogoutNavItem } from './LogoutNavItem';

export const SIDEBAR_WIDTH = 260;

interface NavLinkDef {
  to: string;
  label: string;
  icon: ReactNode;
  /** Точное совпадение пути (для "/"). */
  end?: boolean;
}

const mainLinks: NavLinkDef[] = [
  { to: '/', label: 'Home', icon: <HomeOutlinedIcon />, end: true },
  { to: '/campaigns', label: 'Campaigns', icon: <CampaignOutlinedIcon /> },
  { to: '/codes', label: 'Codes', icon: <ConfirmationNumberOutlinedIcon /> },
  { to: '/distributors', label: 'Distributors', icon: <StorefrontOutlinedIcon /> },
  { to: '/users', label: 'Users', icon: <GroupOutlinedIcon /> },
];

function SidebarLink({ to, label, icon, end }: NavLinkDef) {
  const match = useMatch({ path: to, end: end ?? false });
  return (
    <NavItem
      component={RouterLink}
      to={to}
      label={label}
      icon={icon}
      active={Boolean(match)}
    />
  );
}

export interface SidebarProps {
  workspaceName?: string;
  workspaceRole?: string;
  onWorkspaceClick?: () => void;
}

export function Sidebar({
  workspaceName = 'Workspace name and more',
  workspaceRole = 'Distributor',
  onWorkspaceClick,
}: SidebarProps) {
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
      <WorkspaceItem
        name={workspaceName}
        caption={workspaceRole}
        variant="main"
        onClick={onWorkspaceClick}
      />

      <List disablePadding sx={{ flex: 1, mt: 1, '& > * + *': { mt: 0.5 } }}>
        {mainLinks.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </List>

      <List disablePadding sx={{ flexShrink: 0, '& > * + *': { mt: 0.5 } }}>
        <SidebarLink to="/settings" label="Settings" icon={<SettingsOutlinedIcon />} />
        <LogoutNavItem />
      </List>
    </Box>
  );
}

export default Sidebar;
