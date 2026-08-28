import {
  Box,
  ButtonBase,
  Typography,
  type ButtonBaseProps,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { colors, customShadows } from '../../theme';
import { WorkspaceAvatar } from './WorkspaceAvatar';

export interface WorkspaceItemProps extends Omit<ButtonBaseProps, 'children'> {
  name: string;
  /** Подпись под названием — например роль ("Distributor"). */
  caption?: string;
  avatarSrc?: string;
  pro?: boolean;
  /**
   * `main`  — активная строка-триггер свитчера (с шевроном, тень при hover).
   * `list`  — строка в выпадающем списке воркспейсов.
   */
  variant?: 'main' | 'list';
  /** Текущий выбранный воркспейс (для `variant="list"`). */
  selected?: boolean;
}

/**
 * Строка воркспейс-свитчера из Figma (node 4046:78125 → "Multi project").
 */
export function WorkspaceItem({
  name,
  caption,
  avatarSrc,
  pro = false,
  variant = 'main',
  selected = false,
  sx,
  ...rest
}: WorkspaceItemProps) {
  const isMain = variant === 'main';

  return (
    <ButtonBase
      disableRipple
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        p: '2px',
        pr: 0.75,
        borderRadius: '12px',
        textAlign: 'left',
        bgcolor: selected ? colors.interface.grey4 : colors.interface.white,
        transition: 'background-color .15s, box-shadow .15s',
        '&:hover': {
          bgcolor: colors.interface.grey4,
          boxShadow: isMain ? customShadows.soft : 'none',
        },
        '&.Mui-focusVisible': { boxShadow: customShadows.contour },
        ...sx,
      }}
      {...rest}
    >
      <WorkspaceAvatar name={name} src={avatarSrc} size={46} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '22px',
            color: colors.interface.black,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {caption && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: '14px',
                color: colors.interface.grey,
              }}
            >
              {caption}
            </Typography>
          )}
          {pro && (
            <Box
              component="span"
              sx={{
                px: 0.5,
                borderRadius: '4px',
                bgcolor: colors.brand.main,
                color: colors.interface.white,
                fontSize: 10,
                fontWeight: 600,
                lineHeight: '14px',
                letterSpacing: '.04em',
              }}
            >
              PRO
            </Box>
          )}
        </Box>
      </Box>

      {isMain && (
        <KeyboardArrowDownRoundedIcon
          sx={{ fontSize: 20, color: colors.interface.black2, flexShrink: 0 }}
        />
      )}
    </ButtonBase>
  );
}

export default WorkspaceItem;
