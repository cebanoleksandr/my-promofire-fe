import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import RequireAuth from '../components/routing/RequireAuth';
import GuestOnly from '../components/routing/GuestOnly';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
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

export const routes: RouteObject[] = [
  {
    Component: GuestOnly,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: '/login', Component: LoginPage },
          { path: '/register', Component: RegisterPage },
        ],
      },
    ],
  },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      {
        Component: MainLayout,
        children: [
          { index: true, Component: HomePage },
          { path: 'campaigns', Component: CampaignsPage },
          { path: 'campaigns/create', Component: CreateCampaignPage },
          { path: 'campaigns/:campaignId', Component: CampaignDetailPage },
          { path: 'codes', Component: CodesPage },
          { path: 'codes/:codeId', Component: CodeDetailPage },
          { path: 'distributors', Component: DistributorsPage },
          { path: 'distributors/:id', Component: DistributorDetailPage },
          { path: 'users', Component: UsersPage },
          { path: 'users/:id', Component: UserDetailPage },
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
