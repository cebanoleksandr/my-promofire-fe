import { Box } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme';
import { useThemeMode } from '../../lib/use-theme-mode';

export function ThemeSwitcher() {
  const { mode, toggleMode } = useThemeMode();
  const { t } = useTranslation('layout');
  const isDark = mode === 'dark';

  return (
    <Box
      component="button"
      type="button"
      onClick={toggleMode}
      aria-label={t('header.toggleTheme')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: colors.interface.grey,
        '&:hover': { backgroundColor: colors.interface.grey4, color: colors.interface.black },
      }}
    >
      {isDark ? <LightModeRoundedIcon sx={{ fontSize: 20 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 20 }} />}
    </Box>
  );
}

export default ThemeSwitcher;
