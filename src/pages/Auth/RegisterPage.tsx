import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useRegister } from '../../network/hooks';
import { Button, TextField } from '../../components/ui';
import { AuthCard } from './AuthCard';
import { PasswordField } from './PasswordField';
import { registerSchema, type RegisterFormValues } from './schema';

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      workspaceName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(({ workspaceName, email, password }) => {
    registerMutation.mutate(
      { workspaceName: workspaceName!, email: email!, password: password! },
      { onSuccess: () => navigate('/', { replace: true }) },
    );
  });

  return (
    <AuthCard
      title="Create account"
      subtitle="Start using Promofire"
      error={registerMutation.error?.message}
      onSubmit={onSubmit}
      footer={
        <>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Log in
          </Link>
        </>
      }
    >
      <TextField
        label="Workspace name"
        placeholder="Acme Inc."
        error={!!errors.workspaceName}
        helperText={errors.workspaceName?.message}
        {...register('workspaceName')}
      />
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />
      <PasswordField
        label="Repeat password"
        autoComplete="new-password"
        placeholder="••••••••"
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
        Create account
      </Button>
    </AuthCard>
  );
};

export default RegisterPage;
