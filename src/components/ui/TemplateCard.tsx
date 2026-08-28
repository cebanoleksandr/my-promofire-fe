import { Box, ButtonBase, Radio, Typography, type ButtonBaseProps } from '@mui/material';
import { colors, customShadows } from '../../theme';

export interface TemplateCardProps extends Omit<ButtonBaseProps, 'onChange' | 'title'> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}

/**
 * Выбираемая карточка из Figma (node 4042:76267 → "Lg picker",
 * состояния Default / hover / active). border grey-3, radius 8, height 76.
 */
export function TemplateCard({
  title,
  description,
  icon,
  selected = false,
  onSelect,
  sx,
  ...rest
}: TemplateCardProps) {
  return (
    <ButtonBase
      role="radio"
      aria-checked={selected}
      disableRipple
      onClick={onSelect}
      sx={{
        width: '100%',
        minHeight: 76,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        textAlign: 'left',
        borderRadius: '8px',
        border: `1px solid ${selected ? colors.brand.main : colors.interface.grey3}`,
        bgcolor: colors.interface.white,
        transition: 'border-color .15s, box-shadow .15s',
        '&:hover': { boxShadow: customShadows.soft },
        '&.Mui-focusVisible': { boxShadow: customShadows.contour },
        ...sx,
      }}
      {...rest}
    >
      {icon ? (
        <Box sx={{ flexShrink: 0, display: 'inline-flex', color: colors.brand.main }}>
          {icon}
        </Box>
      ) : (
        <Radio checked={selected} disableRipple tabIndex={-1} sx={{ p: 0, flexShrink: 0 }} />
      )}

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            lineHeight: '26px',
            color: colors.interface.black,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: '22px',
              color: colors.interface.black2,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );
}

export default TemplateCard;
