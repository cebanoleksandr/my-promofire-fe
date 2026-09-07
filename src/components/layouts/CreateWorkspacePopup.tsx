import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Typography } from '@mui/material';
import { useCreateWorkspace } from '../../network/hooks';
import { Button, TextField } from '../ui';
import BasePopup from '../popups/BasePopup';
import { colors } from '../../theme';

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('createWorkspace.nameRequired')
    .min(2, 'createWorkspace.nameMin'),
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
  const { t } = useTranslation('layout');
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
          {t('createWorkspace.title')}
        </Typography>
        <Typography
          sx={{ fontSize: 14, lineHeight: '22px', color: colors.interface.grey, mt: -1 }}
        >
          {t('createWorkspace.subtitle')}
        </Typography>

        {create.error && <Alert severity="error">{create.error.message}</Alert>}

        <TextField
          label={t('createWorkspace.nameLabel')}
          placeholder={t('createWorkspace.namePlaceholder')}
          autoFocus
          error={!!errors.name}
          helperText={errors.name?.message ? t(errors.name.message) : undefined}
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
            {t('createWorkspace.cancel')}
          </Button>
          <Button variant="main" size="M" type="submit" loading={create.isPending}>
            {t('createWorkspace.create')}
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default CreateWorkspacePopup;
