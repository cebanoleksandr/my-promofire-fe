import { Role } from '../../types/membership';
import type { PopperPlacementType } from '@mui/material';

export interface DiscoveryStep {
  id: string;
  title: string;
  description: string;
  route: string;
  /** Значение data-discovery-target на элементе, к которому крепится тултип. */
  anchor: string;
  /** По умолчанию 'right-start' (пункты сайдбара). */
  placement?: PopperPlacementType;
  /** Этим ролям шаг не показывается (страница им и так недоступна). */
  hideFor?: Role[];
}

// Порядок шагов = порядок разделов в сайдбаре, последним — Profile (аватар в шапке)
export const discoverySteps: DiscoveryStep[] = [
  {
    id: 'home',
    title: 'Home',
    description:
      'Connect SDK to get real-time updates on user activity. View general stats on users, codes, devices, and countries.',
    route: '/',
    anchor: 'nav-home',
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    description:
      "Manage and set up your campaigns, track all campaign details and codes' performance.",
    route: '/campaigns',
    anchor: 'nav-campaigns',
  },
  {
    id: 'codes',
    title: 'Codes',
    description: 'Access and sort all codes, track details for all campaigns.',
    route: '/codes',
    anchor: 'nav-codes',
  },
  {
    id: 'distributors',
    title: 'Distributors',
    description: 'Invite and manage distributors, track their results.',
    route: '/distributors',
    anchor: 'nav-distributors',
    hideFor: [Role.DISTRIBUTOR],
  },
  {
    id: 'users',
    title: 'Users',
    description: 'Sort users and gain insights about them.',
    route: '/users',
    anchor: 'nav-users',
    hideFor: [Role.DISTRIBUTOR],
  },
  {
    id: 'settings',
    title: 'SDK Settings',
    description: 'Grab your SDK keys for iOS, Android and Web, and set up general workspace settings.',
    route: '/settings',
    anchor: 'nav-settings',
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage account info, handle payments, and invite team admins.',
    route: '/profile',
    anchor: 'header-avatar',
    placement: 'bottom-end',
  },
];
