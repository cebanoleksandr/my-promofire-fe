import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, Box, Typography } from '@mui/material';
import { useCreateWorkspace } from '../../network/hooks';
import { Button, TextField } from '../ui';
import BasePopup from '../popups/BasePopup';
import { colors } from '../../theme';

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Enter a workspace name')
    .min(2, 'At least 2 characters'),
});

type Values = yup.InferType<typeof schema>;

export interface CreateWorkspacePopupProps {
  isVisible: boolean;
  onClose: () => void;
  /** Вызывается после успешного создания (воркспейс уже переключён). */
  onCreated?: () => void;
}

export function CreateWorkspacePopup({
  isVisible,
  onClose,
  onCreated,
}: CreateWorkspacePopupProps) {
  const create = useCreateWorkspace();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: yupResolver(schema),
    defaultValues: { name: '' },
  });

  const close = () => {
    if (create.isPending) return;
    reset();
    create.reset();
    onClose();
  };

  const submit = handleSubmit(({ name }) => {
    create.mutate(
      { name: name! },
      {
        onSuccess: () => {
          reset();
          create.reset();
          onClose();
          onCreated?.();
        },
      },
    );
  });

  return (
    <BasePopup isVisible={isVisible} onClose={close}>
      <Box
        component="form"
        noValidate
        onSubmit={submit}
        sx={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>
          New workspace
        </Typography>
        <Typography
          sx={{ fontSize: 14, lineHeight: '22px', color: colors.interface.grey, mt: -1 }}
        >
          You’ll be switched into it right away.
        </Typography>

        {create.error && <Alert severity="error">{create.error.message}</Alert>}

        <TextField
          label="Workspace name"
          placeholder="Acme Inc."
          autoFocus
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />

        <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="white"
            size="M"
            type="button"
            onClick={close}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button variant="main" size="M" type="submit" loading={create.isPending}>
            Create
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default CreateWorkspacePopup;
