import { useState, type FormEvent, type ReactNode } from 'react';
import { Avatar, Box, Menu, MenuItem } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
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
  const [avatarAnchor, setAvatarAnchor] = useState<HTMLElement | null>(null);

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
        <>
          <Avatar
            data-discovery-target="header-avatar"
            onClick={(e) => setAvatarAnchor(e.currentTarget)}
            sx={{
              width: 32,
              height: 32,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              // акцент аватара пользователя — вне токенов дизайн-системы
              bgcolor: '#8B7BF2',
            }}
          >
            {userName.trim().charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Menu
            anchorEl={avatarAnchor}
            open={!!avatarAnchor}
            onClose={() => setAvatarAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setAvatarAnchor(null);
                navigate('/profile');
              }}
            >
              <PersonOutlineRoundedIcon sx={{ fontSize: 18, mr: 1, color: colors.interface.grey }} />
              Profile
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}

export default Header;
