import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useLogin } from '../../network/hooks';
import { Button, TextField } from '../../components/ui';
import { AuthCard } from './AuthCard';
import { PasswordField } from './PasswordField';
import { loginSchema, type LoginFormValues } from './schema';

const LoginPage = () => {
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
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    login.mutate(
      { email: email!, password: password! },
      { onSuccess: () => navigate(redirectTo, { replace: true }) },
    );
  });

  return (
    <AuthCard
      title="Log in"
      subtitle="Welcome back to Promofire"
      error={login.error?.message}
      onSubmit={onSubmit}
      footer={
        <>
          No account?{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            Create one
          </Link>
        </>
      }
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" fullWidth loading={login.isPending} sx={{ mt: 1 }}>
        Log in
      </Button>
    </AuthCard>
  );
};

export default LoginPage;
