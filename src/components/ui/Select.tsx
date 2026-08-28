import { useId, useState, type ReactNode } from 'react';
import {
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
  type ButtonBaseProps,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { colors, customShadows } from '../../theme';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  /** Приглушённая подпись во второй строке пункта. */
  caption?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string>
  extends Omit<ButtonBaseProps, 'onChange' | 'value'> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  /** Текст пустого списка (Figma "Property 1=nothing"). */
  emptyText?: string;
  fullWidth?: boolean;
}

/**
 * Выпадающий выбор из Figma (node 316:11813 "Roll-second" +
 * 316:12042 / 2271:97100 "Selectors"). Триггер height 46, radius 8;
 * меню — тень contour, пункты с чек-иконкой и пустым состоянием.
 */
export function Select<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select',
  label,
  error = false,
  emptyText = 'Nothing here yet',
  fullWidth = true,
  sx,
  ...rest
}: SelectProps<T>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const labelId = useId();
  const open = Boolean(anchor);
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <Typography
          id={labelId}
          sx={{
            mb: 0.75,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '22px',
            color: colors.interface.black2,
          }}
        >
          {label}
        </Typography>
      )}

      <ButtonBase
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        disableRipple
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          width: fullWidth ? '100%' : 'auto',
          minHeight: 46,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          borderRadius: '8px',
          bgcolor: colors.interface.white,
          border: `1px solid ${
            error
              ? colors.supportive.red
              : open
                ? colors.brand.main
                : colors.interface.grey3
          }`,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '22px',
          color: selected ? colors.interface.black : colors.interface.grey2,
          transition: 'border-color .15s',
          ...sx,
        }}
        {...rest}
      >
        {selected?.icon}
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? placeholder}
        </span>
        <KeyboardArrowDownRoundedIcon
          sx={{
            fontSize: 20,
            color: colors.interface.black2,
            transition: 'transform .15s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: anchor?.offsetWidth,
              borderRadius: '12px',
              border: `1px solid ${colors.interface.grey3}`,
              boxShadow: customShadows.contour,
            },
          },
        }}
      >
        {options.length === 0 && (
          <MenuItem disabled sx={{ color: colors.interface.grey, fontSize: 14 }}>
            {emptyText}
          </MenuItem>
        )}

        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={opt.value === value}
            disabled={opt.disabled}
            onClick={() => {
              onChange(opt.value);
              setAnchor(null);
            }}
            sx={{
              gap: 1,
              borderRadius: '8px',
              mx: 0.5,
              my: 0.25,
              alignItems: 'flex-start',
              '&.Mui-selected': { bgcolor: colors.interface.grey4 },
            }}
          >
            {opt.icon}
            <span style={{ flex: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: '22px' }}>
                {opt.label}
              </Typography>
              {opt.caption && (
                <Typography
                  sx={{ fontSize: 12, lineHeight: '16px', color: colors.interface.grey }}
                >
                  {opt.caption}
                </Typography>
              )}
            </span>
            {opt.value === value && (
              <CheckRoundedIcon sx={{ fontSize: 18, color: colors.brand.main }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default Select;
