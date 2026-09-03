import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import RequireAuth from '../components/routing/RequireAuth';
import RequireRole from '../components/routing/RequireRole';
import GuestOnly from '../components/routing/GuestOnly';
import { Role } from '../types/membership';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import SelectWorkspacePage from '../pages/Auth/SelectWorkspacePage';
import CampaignDetailPage from '../pages/CampaignDetailPage';
import CampaignsPage from '../pages/CampaignsPage';
import CodeDetailPage from '../pages/CodeDetailPage';
import CodesPage from '../pages/CodesPage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import DistributorDetailPage from '../pages/DistributorDetailPage';
import DistributorsPage from '../pages/DistributorsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import SearchPage from '../pages/SearchPage';
import SettingsPage from '../pages/SettingsPage';
import UserDetailPage from '../pages/UserDetailPage';
import UsersPage from '../pages/UsersPage';
import AcceptInvitation from '../pages/Auth/AcceptInvitation';
import DistributorCodes from '../pages/DistributorCodes';
import DistributorCampaigns from '../pages/DistributorCampaigns';
import CampaignCodes from '../pages/CampaignCodes';
import UserCodes from '../pages/UserCodes';
import CodeUsers from '../pages/CodeUsers';

export const routes: RouteObject[] = [
  {
    Component: GuestOnly,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: '/login', Component: LoginPage },
          { path: '/register', Component: RegisterPage },
          { path: '/accept-invite', Component: AcceptInvitation },
        ],
      },
    ],
  },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      { path: 'select-workspace', Component: SelectWorkspacePage },
      {
        Component: MainLayout,
        children: [
          { index: true, Component: HomePage },
          { path: 'campaigns', Component: CampaignsPage },
          { path: 'campaigns/:campaignId', Component: CampaignDetailPage },
          { path: 'campaigns/:campaignId/codes', Component: CampaignCodes },
          { path: 'codes', Component: CodesPage },
          { path: 'codes/:codeId', Component: CodeDetailPage },
          { path: 'codes/:codeId/users', Component: CodeUsers },
          {
            element: <RequireRole deny={[Role.DISTRIBUTOR]} />,
            children: [
              { path: 'campaigns/create', Component: CreateCampaignPage },
              { path: 'distributors', Component: DistributorsPage },
              { path: 'distributors/:id', Component: DistributorDetailPage },
              { path: 'distributors/:id/codes', Component: DistributorCodes },
              { path: 'distributors/:id/campaigns', Component: DistributorCampaigns },
              { path: 'users', Component: UsersPage },
              { path: 'users/:id', Component: UserDetailPage },
              { path: 'users/:id/codes', Component: UserCodes },
            ],
          },
          { path: 'profile', Component: ProfilePage },
          { path: 'settings', Component: SettingsPage },
          { path: 'search', Component: SearchPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
