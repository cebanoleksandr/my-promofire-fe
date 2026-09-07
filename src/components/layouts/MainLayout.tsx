import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { colors } from '../../theme';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import CustomAlert from '../ui/CustomAlert';
import { DiscoveryGate } from '../discovery/DiscoveryGate';

export function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100dvh', bgcolor: colors.interface.grey4 }}>
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuClick={() => setMobileNavOpen(true)} />

        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            p: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <CustomAlert />
      <DiscoveryGate />
    </Box>
  );
}

export default MainLayout;
