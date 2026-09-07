import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../../network/hooks';
import { Button, TextField } from '../../components/ui';
import { AuthCard } from './AuthCard';
import { PasswordField } from './PasswordField';
import { getRegisterSchema, type RegisterFormValues } from './schema';

const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(getRegisterSchema(t)),
    defaultValues: {
      workspaceName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(
    ({ workspaceName, firstName, lastName, email, password }) => {
      registerMutation.mutate(
        {
          workspaceName: workspaceName!,
          email: email!,
          password: password!,
          firstName,
          lastName,
        },
        { onSuccess: () => navigate('/', { replace: true }) },
      );
    },
  );

  return (
    <AuthCard
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      error={registerMutation.error?.message}
      onSubmit={onSubmit}
      footer={
        <>
          {t('register.hasAccount')}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {t('register.logIn')}
          </Link>
        </>
      }
    >
      <TextField
        label={t('register.workspaceNameLabel')}
        placeholder={t('register.workspaceNamePlaceholder')}
        error={!!errors.workspaceName}
        helperText={errors.workspaceName?.message}
        {...register('workspaceName')}
      />
      <TextField
        label={t('register.firstNameLabel')}
        autoComplete="given-name"
        placeholder={t('register.firstNamePlaceholder')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        {...register('firstName')}
      />
      <TextField
        label={t('register.lastNameLabel')}
        autoComplete="family-name"
        placeholder={t('register.lastNamePlaceholder')}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        {...register('lastName')}
      />
      <TextField
        label={t('register.emailLabel')}
        type="email"
        autoComplete="email"
        placeholder={t('register.emailPlaceholder')}
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label={t('register.passwordLabel')}
        autoComplete="new-password"
        placeholder={t('register.passwordPlaceholder')}
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />
      <PasswordField
        label={t('register.confirmPasswordLabel')}
        autoComplete="new-password"
        placeholder={t('register.confirmPasswordPlaceholder')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button
        type="submit"
        fullWidth
        loading={registerMutation.isPending}
        sx={{ mt: 1 }}
      >
        {t('register.submit')}
      </Button>
    </AuthCard>
  );
};

export default RegisterPage;
