import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import App from '../App';
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
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        path: '/register',
        Component: RegisterPage,
      },
      {
        path: '/campaigns',
        Component: CampaignsPage,
      },
      {
        path: '/codes',
        Component: CodesPage,
      },
      {
        path: '/codes/:codeId',
        Component: CodeDetailPage,
      },
      {
        path: '/campaigns/:campaignId',
        Component: CampaignDetailPage,
      },
      {
        path: '/distributors',
        Component: DistributorsPage,
      },
      {
        path: '/distributors/:id',
        Component: DistributorDetailPage,
      },
      {
        path: '/users',
        Component: UsersPage,
      },
      {
        path: '/users/:id',
        Component: UserDetailPage,
      },
      {
        path: '/profile',
        Component: ProfilePage,
      },
      {
        path: '/settings',
        Component: SettingsPage,
      },
      {
        path: '/campaigns/create',
        Component: CreateCampaignPage,
      },
      {
        path: '/search',
        Component: SearchPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ]
  },
];

const router = createBrowserRouter(routes);

export default router;
