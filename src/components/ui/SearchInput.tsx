import { forwardRef, type InputHTMLAttributes } from 'react';
import { Box, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { colors } from '../../theme';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  fullWidth?: boolean;
}

/**
 * Поле поиска из Figma (node 2924:60215 → "Search": Default / active).
 * height 42, radius 8, ведущая лупа, крестик очистки при вводе.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value, onChange, onClear, placeholder = 'Search', fullWidth = true, ...rest },
    ref,
  ) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: fullWidth ? '100%' : 'auto',
          minHeight: 42,
          px: 1.5,
          borderRadius: '8px',
          bgcolor: colors.interface.white,
          border: `1px solid ${colors.interface.grey3}`,
          transition: 'border-color .15s',
          '&:focus-within': { borderColor: colors.brand.main },
        }}
      >
        <SearchRoundedIcon sx={{ fontSize: 18, color: colors.interface.grey }} />
        <Box
          component="input"
          ref={ref}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            bgcolor: 'transparent',
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: '22px',
            color: colors.interface.black,
            '&::placeholder': { color: colors.interface.grey2 },
          }}
          {...rest}
        />
        {value && (
          <IconButton
            size="small"
            aria-label="clear"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            sx={{ p: 0.25, color: colors.interface.grey }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    );
  },
);

export default SearchInput;
