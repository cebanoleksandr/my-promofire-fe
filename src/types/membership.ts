export const Role = {
  OWNER: 'owner',
  ADMIN: 'admin',
  DISTRIBUTOR: 'distributor',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const MembershipStatus = {
  PENDING: 'pending', // приглашён, но ещё не принял инвайт
  ACTIVE: 'active',
} as const;

export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];

// "Сырое" членство — то, что возвращают invite/activate/deactivate (без email)
export interface Membership {
  id: string;
  accountId: string;
  workspaceId: string;
  role: Role;
  status: MembershipStatus;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// То, что возвращает GET /memberships/my-team — Membership + данные из связанного Account
export interface TeamMember extends Membership {
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
}

export interface InviteDto {
  email: string;
  // Обязателен только для Owner'а — у него есть выбор (Admin или Distributor
  // напрямую). Admin может не передавать — у него выбора нет, всегда Distributor
  role?: Role;
}
