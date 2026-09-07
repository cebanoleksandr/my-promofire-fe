import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../../network/hooks';
import { isWorkspaceAuthResponse } from '../../types/auth';
import { Button, TextField } from '../../components/ui';
import { AuthCard } from './AuthCard';
import { PasswordField } from './PasswordField';
import { getLoginSchema, type LoginFormValues } from './schema';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(getLoginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    login.mutate(
      { email: email!, password: password! },
      {
        onSuccess: (res) => {
          // Один воркспейс или бэкенд сам вернул последний активный —
          // заходим сразу. Иначе показываем выбор воркспейса.
          navigate(isWorkspaceAuthResponse(res) ? redirectTo : '/select-workspace', {
            replace: true,
          });
        },
      },
    );
  });

  return (
    <AuthCard
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      error={login.error?.message}
      onSubmit={onSubmit}
      footer={
        <>
          {t('login.noAccount')}{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            {t('login.createOne')}
          </Link>
        </>
      }
    >
      <TextField
        label={t('login.emailLabel')}
        type="email"
        autoComplete="email"
        placeholder={t('login.emailPlaceholder')}
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label={t('login.passwordLabel')}
        autoComplete="current-password"
        placeholder={t('login.passwordPlaceholder')}
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" fullWidth loading={login.isPending} sx={{ mt: 1 }}>
        {t('login.submit')}
      </Button>
    </AuthCard>
  );
};

export default LoginPage;
