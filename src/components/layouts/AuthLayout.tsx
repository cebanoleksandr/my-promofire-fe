import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { colors } from '../../theme';

/**
 * Пустой каркас для страниц авторизации: без Sidebar и Header,
 * только отцентрированная область контента.
 */
export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: colors.interface.grey4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default AuthLayout;
