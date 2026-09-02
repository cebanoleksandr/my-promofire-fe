import { StatusChip, type StatusChipProps } from './StatusChip';
import { PromoCodeStatus, PromoCodeDisplayStatus } from '../../types/promo-code';
import { MembershipStatus } from '../../types/membership';

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

// Вычисляемый на бэке статус для листинга кодов (учитывает истечение срока)
const promoCodeDisplayMap: Record<PromoCodeDisplayStatus, Mapped> = {
  [PromoCodeDisplayStatus.ACTIVE]: { label: 'Active', tone: 'info' },
  [PromoCodeDisplayStatus.DEACTIVATED]: { label: 'Deactivated', tone: 'neutral' },
  [PromoCodeDisplayStatus.REDEEMED]: { label: 'Redeemed', tone: 'success' },
  [PromoCodeDisplayStatus.EXPIRED]: { label: 'Expired', tone: 'error' },
};

export interface PromoCodeDisplayStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: PromoCodeDisplayStatus;
}

export function PromoCodeDisplayStatusChip({
  status,
  ...rest
}: PromoCodeDisplayStatusChipProps) {
  const { label, tone } = promoCodeDisplayMap[status];
  return <StatusChip label={label} tone={tone} {...rest} />;
}

// ── Участники команды (дистрибьюторы / пользователи) ───────────────────
export interface MemberStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: MembershipStatus;
  isActive: boolean;
}

export function MemberStatusChip({ status, isActive, ...rest }: MemberStatusChipProps) {
  let mapped: Mapped;
  if (!isActive) mapped = { label: 'Deactivated', tone: 'neutral' };
  else if (status === MembershipStatus.PENDING)
    mapped = { label: 'Invite sent', tone: 'info' };
  else mapped = { label: 'Active', tone: 'success' };

  return <StatusChip label={mapped.label} tone={mapped.tone} {...rest} />;
}
