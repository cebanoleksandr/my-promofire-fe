import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { useAcceptInvite } from '../../network/hooks';
import { Button } from '../../components/ui';
import { AuthCard } from './AuthCard';
import { PasswordField } from './PasswordField';
import { acceptInviteSchema, type AcceptInviteFormValues } from './schema';
import { colors } from '../../theme';

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const acceptInvite = useAcceptInvite();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormValues>({
    resolver: yupResolver(acceptInviteSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token) {
    return (
      <AuthCard title="Invalid invitation" onSubmit={() => {}}>
        <Typography sx={{ fontSize: 14, lineHeight: '22px', color: colors.interface.grey }}>
          This invitation link is missing or malformed. Ask the workspace admin to
          send you a new invite, or{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            log in
          </Link>{' '}
          if you already have an account.
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
      title="Accept invitation"
      subtitle="Set a password to join the workspace"
      error={acceptInvite.error?.message}
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
        loading={acceptInvite.isPending}
        sx={{ mt: 1 }}
      >
        Accept invitation
      </Button>
    </AuthCard>
  );
};

export default AcceptInvitation;
