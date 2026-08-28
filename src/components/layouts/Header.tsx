import { useState, type ReactNode } from 'react';
import { Avatar, Box } from '@mui/material';
import { colors } from '../../theme';
import { SearchInput } from '../ui';

export const HEADER_HEIGHT = 64;

export interface HeaderProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Правый слот — по умолчанию аватар пользователя. */
  actions?: ReactNode;
  userName?: string;
}

export function Header({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  actions,
  userName = 'User',
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState('');
  const value = search ?? localSearch;
  const handleChange = onSearchChange ?? setLocalSearch;

  return (
    <Box
      component="header"
      sx={{
        height: HEADER_HEIGHT,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        bgcolor: colors.interface.white,
        borderBottom: `1px solid ${colors.interface.grey3}`,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 560 }}>
        <SearchInput
          value={value}
          onChange={handleChange}
          placeholder={searchPlaceholder}
        />
      </Box>

      <Box sx={{ flex: 1 }} />

      {actions ?? (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: 14,
            fontWeight: 600,
            // акцент аватара пользователя — вне токенов дизайн-системы
            bgcolor: '#8B7BF2',
          }}
        >
          {userName.trim().charAt(0).toUpperCase() || 'U'}
        </Avatar>
      )}
    </Box>
  );
}

export default Header;
