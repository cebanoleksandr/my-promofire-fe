import { useTranslation } from 'react-i18next';
import { StatusChip, type StatusChipProps } from './StatusChip';
import { PromoCodeStatus, PromoCodeDisplayStatus } from '../../types/promo-code';
import { MembershipStatus } from '../../types/membership';

type Mapped = { labelKey: string; tone: StatusChipProps['tone'] };

// ── Промокоды ──────────────────────────────────────────────────────────
const promoCodeMap: Record<PromoCodeStatus, Mapped> = {
  [PromoCodeStatus.ACTIVE]: { labelKey: 'statusChips.active', tone: 'info' },
  [PromoCodeStatus.EXHAUSTED]: { labelKey: 'statusChips.redeemed', tone: 'success' },
  [PromoCodeStatus.DISABLED]: { labelKey: 'statusChips.deactivated', tone: 'neutral' },
};

export interface PromoCodeStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: PromoCodeStatus;
}

export function PromoCodeStatusChip({ status, ...rest }: PromoCodeStatusChipProps) {
  const { t } = useTranslation('common');
  const { labelKey, tone } = promoCodeMap[status];
  return <StatusChip label={t(labelKey)} tone={tone} {...rest} />;
}

// Вычисляемый на бэке статус для листинга кодов (учитывает истечение срока)
const promoCodeDisplayMap: Record<PromoCodeDisplayStatus, Mapped> = {
  [PromoCodeDisplayStatus.ACTIVE]: { labelKey: 'statusChips.active', tone: 'info' },
  [PromoCodeDisplayStatus.DEACTIVATED]: { labelKey: 'statusChips.deactivated', tone: 'neutral' },
  [PromoCodeDisplayStatus.REDEEMED]: { labelKey: 'statusChips.redeemed', tone: 'success' },
  [PromoCodeDisplayStatus.EXPIRED]: { labelKey: 'statusChips.expired', tone: 'error' },
};

export interface PromoCodeDisplayStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: PromoCodeDisplayStatus;
}

export function PromoCodeDisplayStatusChip({
  status,
  ...rest
}: PromoCodeDisplayStatusChipProps) {
  const { t } = useTranslation('common');
  const { labelKey, tone } = promoCodeDisplayMap[status];
  return <StatusChip label={t(labelKey)} tone={tone} {...rest} />;
}

// ── Участники команды (дистрибьюторы / пользователи) ───────────────────
export interface MemberStatusChipProps
  extends Omit<StatusChipProps, 'label' | 'tone'> {
  status: MembershipStatus;
  isActive: boolean;
}

export function MemberStatusChip({ status, isActive, ...rest }: MemberStatusChipProps) {
  const { t } = useTranslation('common');
  let mapped: Mapped;
  if (!isActive) mapped = { labelKey: 'statusChips.deactivated', tone: 'neutral' };
  else if (status === MembershipStatus.PENDING)
    mapped = { labelKey: 'statusChips.inviteSent', tone: 'info' };
  else mapped = { labelKey: 'statusChips.active', tone: 'success' };

  return <StatusChip label={t(mapped.labelKey)} tone={mapped.tone} {...rest} />;
}
