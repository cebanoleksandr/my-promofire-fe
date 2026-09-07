import { useState } from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { useTranslation } from 'react-i18next';
import { colors, fontStyles } from '../../theme';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../lib/i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const current = (i18n.resolvedLanguage ?? 'en') as SupportedLanguage;

  const handleSelect = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng);
    setAnchor(null);
  };

  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: '8px',
          cursor: 'pointer',
          color: colors.interface.grey,
          '&:hover': { backgroundColor: colors.interface.grey4, color: colors.interface.black },
        }}
      >
        <LanguageRoundedIcon sx={{ fontSize: 20 }} />
        <Typography sx={{ ...fontStyles.sM, textTransform: 'uppercase' }}>{current}</Typography>
      </Box>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {SUPPORTED_LANGUAGES.map((lng) => (
          <MenuItem key={lng} selected={lng === current} onClick={() => handleSelect(lng)}>
            {LANGUAGE_LABELS[lng]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default LanguageSwitcher;
