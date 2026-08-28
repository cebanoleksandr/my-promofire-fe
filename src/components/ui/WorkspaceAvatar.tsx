import { Avatar, type AvatarProps } from '@mui/material';
import { colors } from '../../theme';

export interface WorkspaceAvatarProps extends Omit<AvatarProps, 'children'> {
  name: string;
  /** URL картинки; если нет — показываем первую букву названия. */
  src?: string;
  size?: number;
}

/**
 * Аватар воркспейса из Figma (node 4042:76299 → "avatar").
 * Скруглённый квадрат radius 12, бренд-фон, буква 20/500.
 */
export function WorkspaceAvatar({
  name,
  src,
  size = 46,
  sx,
  ...rest
}: WorkspaceAvatarProps) {
  return (
    <Avatar
      variant="rounded"
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        borderRadius: '12px',
        bgcolor: colors.brand.main,
        color: colors.interface.white,
        border: `1px solid ${colors.interface.grey3}`,
        fontSize: size * 0.43,
        fontWeight: 500,
        lineHeight: 1.4,
        ...sx,
      }}
      {...rest}
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </Avatar>
  );
}

export default WorkspaceAvatar;
