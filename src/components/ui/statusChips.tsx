import { StatusChip, type StatusChipProps } from './StatusChip';
import { PromoCodeStatus } from '../../types/promo-code';
import { UserStatus } from '../../types/user';

type Mapped = { label: string; tone: StatusChipProps['tone'] };

// ── Промокоды ──────────────────────────────────────────────────────────
const promoCodeMap: Record<PromoCodeStatus, Mapped> = {
  [PromoCodeStatus.ACTIVE]: { label: 'Active', tone: 'info' },
  [PromoCodeStatus.EXHAUSTED]: { label: 'Redeemed', tone: 'success' },
  [PromoCodeStatus.DISABLED]: { label: 'Deactivated', tone: 'neutral' },
  [PromoCodeStatus.EXPIRED]: { label: 'Expired', tone: 'error' },
};

export interface PromoCodeStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: PromoCodeStatus;
}

export function PromoCodeStatusChip({ status, ...rest }: PromoCodeStatusChipProps) {
  const { label, tone } = promoCodeMap[status];
  return <StatusChip label={label} tone={tone} {...rest} />;
}

// ── Участники команды (дистрибьюторы / пользователи) ───────────────────
export interface MemberStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: UserStatus;
  isActive: boolean;
}

export function MemberStatusChip({ status, isActive, ...rest }: MemberStatusChipProps) {
  let mapped: Mapped;
  if (!isActive) mapped = { label: 'Deactivated', tone: 'neutral' };
  else if (status === UserStatus.PENDING)
    mapped = { label: 'Invite sent', tone: 'info' };
  else mapped = { label: 'Active', tone: 'success' };

  return <StatusChip label={mapped.label} tone={mapped.tone} {...rest} />;
}
