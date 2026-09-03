export const Role = {
  OWNER: 'owner',
  ADMIN: 'admin',
  DISTRIBUTOR: 'distributor',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const MembershipStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
} as const;

export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];

export interface Membership {
  id: string;
  accountId: string;
  workspaceId: string;
  role: Role;
  status: MembershipStatus;
  isActive: boolean;
  // Довільний опис / примітка про учасника
  description: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface TeamMember extends Membership {
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
}

// Дані деталей Distributor'а (GET /memberships/:id)
export type DistributorDetail = TeamMember;

export interface UpdateDistributorDetailDto {
  description?: string;
}

export interface InviteDto {
  email: string;
  role?: Role;
}
