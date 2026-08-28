import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { colors } from '../../theme';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * Основной каркас приложения по макету дашборда:
 * фиксированный Sidebar слева, Header сверху, прокручиваемая область контента.
 */
export function MainLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: colors.interface.grey4 }}>
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
