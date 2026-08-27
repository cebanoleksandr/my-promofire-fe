export const Role = {
  OWNER: 'owner',
  ADMIN: 'admin',
  DISTRIBUTOR: 'distributor',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  PENDING: 'pending', // приглашён, но ещё не принял инвайт
  ACTIVE: 'active',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}