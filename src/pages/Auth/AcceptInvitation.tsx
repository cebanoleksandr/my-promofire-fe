import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAcceptInvite } from '../../network/hooks';
import { Button } from '../../components/ui';
import { AuthCard } from './AuthCard';
import { PasswordField } from './PasswordField';
import { getAcceptInviteSchema, type AcceptInviteFormValues } from './schema';
import { colors } from '../../theme';

const AcceptInvitation = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const acceptInvite = useAcceptInvite();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormValues>({
    resolver: yupResolver(getAcceptInviteSchema(t)),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token) {
    return (
      <AuthCard title={t('acceptInvitation.invalidTitle')} onSubmit={() => {}}>
        <Typography sx={{ fontSize: 14, lineHeight: '22px', color: colors.interface.grey }}>
          {t('acceptInvitation.invalidBodyPrefix')}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {t('acceptInvitation.invalidBodyLink')}
          </Link>{' '}
          {t('acceptInvitation.invalidBodySuffix')}
        </Typography>
      </AuthCard>
    );
  }

  const onSubmit = handleSubmit(({ password }) => {
    acceptInvite.mutate(
      { token, password },
      { onSuccess: () => navigate('/', { replace: true }) },
    );
  });

  return (
    <AuthCard
      title={t('acceptInvitation.title')}
      subtitle={t('acceptInvitation.subtitle')}
      error={acceptInvite.error?.message}
      onSubmit={onSubmit}
      footer={
        <>
          {t('acceptInvitation.hasAccount')}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {t('acceptInvitation.logIn')}
          </Link>
        </>
      }
    >
      <PasswordField
        label={t('acceptInvitation.passwordLabel')}
        autoComplete="new-password"
        placeholder={t('acceptInvitation.passwordPlaceholder')}
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />
      <PasswordField
        label={t('acceptInvitation.confirmPasswordLabel')}
        autoComplete="new-password"
        placeholder={t('acceptInvitation.confirmPasswordPlaceholder')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button
        type="submit"
        fullWidth
        loading={acceptInvite.isPending}
        sx={{ mt: 1 }}
      >
        {t('acceptInvitation.submit')}
      </Button>
    </AuthCard>
  );
};

export default AcceptInvitation;
