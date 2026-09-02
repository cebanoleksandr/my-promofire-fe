import { useState, type FormEvent, type ReactNode } from 'react';
import { Avatar, Box } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { colors } from '../../theme';
import { Button, SearchInput } from '../ui';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') ?? '');

  const value = search ?? localSearch;
  const handleChange = onSearchChange ?? setLocalSearch;
  const trimmed = value.trim();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

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
      <Box
        component="form"
        onSubmit={submit}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', maxWidth: 600 }}
      >
        <SearchInput
          value={value}
          onChange={handleChange}
          placeholder={searchPlaceholder}
        />
        {trimmed && (
          <Button
            type="submit"
            size="M"
            aria-label="Search"
            sx={{ flexShrink: 0, px: 1.5 }}
          >
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Button>
        )}
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
