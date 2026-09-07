import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import {
  DiscountType,
  TtlUnit,
  type Campaign,
  type CreateCampaignDto,
} from '../types/campaign';
import { useCampaigns, useCreateCampaign } from '../network/hooks';
import { useAppDispatch } from '../store/hooks';
import { setAlertAC } from '../store/alertSlice';
import {
  Button,
  Select,
  TextField,
  Textarea,
  TemplateCard,
} from '../components/ui';
import { colors } from '../theme';

const toNum = (_: unknown, orig: unknown) =>
  orig === '' || orig == null ? undefined : Number(orig);

// Фабрика схемы валидации — принимает t, чтобы сообщения об ошибках были переведены
function buildSchema(t: TFunction<'campaigns'>) {
  return yup.object({
    name: yup.string().trim().required(t('create.validation.nameRequired')),
    discountType: yup
      .mixed<DiscountType>()
      .oneOf(Object.values(DiscountType))
      .required(),
    discountValue: yup
      .number()
      .transform(toNum)
      .typeError(t('create.validation.numberRequired'))
      .positive(t('create.validation.mustBePositive'))
      .required(t('create.validation.discountValueRequired')),
    ttlUnit: yup.mixed<TtlUnit>().oneOf(Object.values(TtlUnit)).required(),
    ttlAmount: yup
      .number()
      .transform(toNum)
      .typeError(t('create.validation.numberRequired'))
      .positive(t('create.validation.mustBePositive'))
      .integer(t('create.validation.wholeNumbersOnly'))
      .optional(),
    redemptionMode: yup
      .mixed<'unlimited' | 'custom'>()
      .oneOf(['unlimited', 'custom'])
      .required(),
    defaultMaxRedemptions: yup
      .number()
      .transform(toNum)
      .when('redemptionMode', {
        is: 'custom',
        then: (s) =>
          s
            .typeError(t('create.validation.numberRequired'))
            .positive(t('create.validation.mustBePositive'))
            .integer(t('create.validation.wholeNumbersOnly'))
            .required(t('create.validation.limitRequired')),
        otherwise: (s) => s.optional(),
      }),
    payloadText: yup
      .string()
      .test('json', t('create.validation.validJson'), (v) => {
        if (!v || !v.trim()) return true;
        try {
          const parsed = JSON.parse(v);
          return !!parsed && typeof parsed === 'object' && !Array.isArray(parsed);
        } catch {
          return false;
        }
      }),
    payloadMutable: yup.boolean().required(),
    isActive: yup.boolean().required(),
    description: yup.string().trim(),
  });
}

type FormValues = yup.InferType<ReturnType<typeof buildSchema>>;

const emptyValues: FormValues = {
  name: '',
  discountType: DiscountType.PERCENTAGE,
  discountValue: undefined as unknown as number,
  ttlUnit: TtlUnit.MINUTE,
  ttlAmount: undefined,
  redemptionMode: 'unlimited',
  defaultMaxRedemptions: undefined,
  payloadText: '',
  payloadMutable: false,
  isActive: true,
  description: '',
};

// Заполнение формы по существующей кампании (name намеренно не копируем 1:1)
function valuesFromCampaign(c: Campaign): FormValues {
  return {
    name: `${c.name} copy`,
    discountType: c.discountType,
    discountValue: Number(c.discountValue),
    ttlUnit: c.ttlUnit ?? TtlUnit.MINUTE,
    ttlAmount: c.ttlAmount ?? undefined,
    redemptionMode: c.defaultMaxRedemptions == null ? 'unlimited' : 'custom',
    defaultMaxRedemptions: c.defaultMaxRedemptions ?? undefined,
    payloadText: c.payload ? JSON.stringify(c.payload, null, 2) : '',
    payloadMutable: c.payloadMutable,
    isActive: c.isActive,
    description: c.description ?? '',
  };
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        py: 3,
        borderBottom: `1px solid ${colors.interface.grey3}`,
      }}
    >
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: '24px' }}>
          {label}
        </Typography>
        {hint && (
          <Typography
            sx={{ mt: 0.5, fontSize: 14, lineHeight: '20px', color: colors.interface.grey }}
          >
            {hint}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 280, maxWidth: 640 }}>{children}</Box>
    </Box>
  );
}

const CreateCampaignPage = () => {
  const { t } = useTranslation('campaigns');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const create = useCreateCampaign();
  const campaignsQuery = useCampaigns({ limit: 100 });
  const campaigns = campaignsQuery.data?.data ?? [];
  const hasCampaigns = campaigns.length > 0;

  const [mode, setMode] = useState<'scratch' | 'template'>('scratch');
  const [templateId, setTemplateId] = useState<string | null>(null);

  const ttlUnits: { value: TtlUnit; label: string }[] = [
    { value: TtlUnit.MINUTE, label: t('create.fields.ttl.units.minute') },
    { value: TtlUnit.HOUR, label: t('create.fields.ttl.units.hour') },
    { value: TtlUnit.DAY, label: t('create.fields.ttl.units.day') },
    { value: TtlUnit.MONTH, label: t('create.fields.ttl.units.month') },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(buildSchema(t)),
    defaultValues: emptyValues,
    // свой плавный скролл к ошибке вместо мгновенного focus от RHF
    shouldFocusError: false,
  });

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const source = campaigns.find((c) => c.id === id);
    if (source) reset(valuesFromCampaign(source));
  };

  const switchMode = (next: 'scratch' | 'template') => {
    setMode(next);
    if (next === 'scratch') {
      setTemplateId(null);
      reset(emptyValues);
    }
  };

  const discountType = watch('discountType');
  const ttlUnit = watch('ttlUnit');
  const redemptionMode = watch('redemptionMode');
  const payloadMutable = watch('payloadMutable');
  const isActive = watch('isActive');

  const scrollToFirstError = (errs: typeof errors) => {
    const order: (keyof FormValues)[] = [
      'name',
      'discountType',
      'discountValue',
      'ttlUnit',
      'ttlAmount',
      'redemptionMode',
      'defaultMaxRedemptions',
      'payloadText',
      'payloadMutable',
      'isActive',
      'description',
    ];
    const first = order.find((f) => errs[f]);
    if (!first) return;
    const el = document.querySelector<HTMLElement>(`[name="${first}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  };

  const onSubmit = handleSubmit((v) => {
    const payload =
      v.payloadText && v.payloadText.trim()
        ? (JSON.parse(v.payloadText) as Record<string, unknown>)
        : undefined;

    const dto: CreateCampaignDto = {
      name: v.name,
      discountType: v.discountType as DiscountType,
      discountValue: v.discountValue,
      payloadMutable: v.payloadMutable,
      isActive: v.isActive,
      ...(v.ttlAmount != null
        ? { ttlAmount: v.ttlAmount, ttlUnit: v.ttlUnit as TtlUnit }
        : {}),
      ...(v.redemptionMode === 'custom' && v.defaultMaxRedemptions != null
        ? { defaultMaxRedemptions: v.defaultMaxRedemptions }
        : {}),
      ...(payload ? { payload } : {}),
      ...(v.description ? { description: v.description } : {}),
    };

    create.mutate(dto, {
      onSuccess: (campaign) => {
        dispatch(setAlertAC({ text: t('create.toast.created'), mode: 'success' }));
        navigate(`/campaigns/${campaign.id}`);
      },
      onError: (err) => {
        dispatch(setAlertAC({ text: err.message, mode: 'error' }));
      },
    });
  }, scrollToFirstError);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={onSubmit}
      sx={{ maxWidth: 1100, mx: 'auto' }}
    >
      <Typography
        sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px', pb: 3 }}
      >
        {t('create.title')}
      </Typography>

      {create.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {create.error.message}
        </Alert>
      )}

      <Box
        sx={{
          py: 3,
          borderTop: `1px solid ${colors.interface.grey3}`,
          borderBottom: `1px solid ${colors.interface.grey3}`,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TemplateCard
            title={t('create.templateCards.scratch.title')}
            description={t('create.templateCards.scratch.description')}
            selected={mode === 'scratch'}
            onSelect={() => switchMode('scratch')}
            sx={{ flex: 1, minWidth: 280 }}
          />
          <TemplateCard
            title={t('create.templateCards.template.title')}
            description={
              hasCampaigns
                ? t('create.templateCards.template.description')
                : t('create.templateCards.template.descriptionEmpty')
            }
            selected={mode === 'template'}
            disabled={!hasCampaigns}
            onSelect={() => switchMode('template')}
            sx={{ flex: 1, minWidth: 280 }}
          />
        </Box>

        {mode === 'template' && (
          <Box sx={{ mt: 2, maxWidth: 640 }}>
            <Select
              label={t('create.baseCampaign.label')}
              placeholder={t('create.baseCampaign.placeholder')}
              value={templateId}
              onChange={applyTemplate}
              options={campaigns.map((c) => ({ value: c.id, label: c.name }))}
              emptyText={t('create.baseCampaign.empty')}
            />
          </Box>
        )}
      </Box>

      <Field label={t('create.fields.name.label')} hint={t('create.fields.name.hint')}>
        <TextField
          placeholder={t('create.fields.name.placeholder')}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
      </Field>

      <Field label={t('create.fields.discount.label')} hint={t('create.fields.discount.hint')}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <RadioGroup
            row
            value={discountType}
            onChange={(e) =>
              setValue('discountType', e.target.value as DiscountType)
            }
            sx={{ flexShrink: 0, flexWrap: 'wrap' }}
          >
            <FormControlLabel
              value={DiscountType.PERCENTAGE}
              control={<Radio />}
              label={t('create.fields.discount.percentLabel')}
            />
            <FormControlLabel
              value={DiscountType.FIXED_AMOUNT}
              control={<Radio />}
              label={t('create.fields.discount.fixedLabel')}
            />
          </RadioGroup>
          <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
            <TextField
              type="number"
              placeholder={t('create.fields.discount.placeholder')}
              error={!!errors.discountValue}
              helperText={errors.discountValue?.message}
              {...register('discountValue')}
            />
          </Box>
        </Box>
      </Field>

      <Field
        label={t('create.fields.ttl.label')}
        hint={t('create.fields.ttl.hint')}
      >
        <RadioGroup
          row
          value={ttlUnit}
          onChange={(e) => setValue('ttlUnit', e.target.value as TtlUnit)}
        >
          {ttlUnits.map((u) => (
            <FormControlLabel
              key={u.value}
              value={u.value}
              control={<Radio />}
              label={u.label}
            />
          ))}
        </RadioGroup>
        <Box sx={{ mt: 1.5 }}>
          <TextField
            type="number"
            placeholder={t('create.fields.ttl.placeholder')}
            error={!!errors.ttlAmount}
            helperText={errors.ttlAmount?.message}
            {...register('ttlAmount')}
          />
        </Box>
      </Field>

      <Field label={t('create.fields.redemption.label')} hint={t('create.fields.redemption.hint')}>
        <RadioGroup
          row
          value={redemptionMode}
          onChange={(e) =>
            setValue('redemptionMode', e.target.value as 'unlimited' | 'custom')
          }
        >
          <FormControlLabel
            value="unlimited"
            control={<Radio />}
            label={t('create.fields.redemption.unlimited')}
          />
          <FormControlLabel value="custom" control={<Radio />} label={t('create.fields.redemption.custom')} />
        </RadioGroup>
        {redemptionMode === 'custom' && (
          <Box sx={{ mt: 1.5 }}>
            <TextField
              type="number"
              placeholder={t('create.fields.redemption.placeholder')}
              error={!!errors.defaultMaxRedemptions}
              helperText={errors.defaultMaxRedemptions?.message}
              {...register('defaultMaxRedemptions')}
            />
          </Box>
        )}
      </Field>

      <Field
        label={t('create.fields.payload.label')}
        hint={t('create.fields.payload.hint')}
      >
        <Textarea
          minRows={5}
          placeholder={t('create.fields.payload.placeholder')}
          error={!!errors.payloadText}
          helperText={errors.payloadText?.message}
          {...register('payloadText')}
        />
      </Field>

      <Field
        label={t('create.fields.mutable.label')}
        hint={t('create.fields.mutable.hint')}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={payloadMutable}
              onChange={(e) => setValue('payloadMutable', e.target.checked)}
            />
          }
          label={t('create.fields.mutable.checkboxLabel')}
        />
      </Field>

      <Field label={t('create.fields.availability.label')} hint={t('create.fields.availability.hint')}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setValue('isActive', e.target.checked)}
            />
          }
          label={t('create.fields.availability.checkboxLabel')}
        />
      </Field>

      <Field
        label={t('create.fields.description.label')}
        hint={t('create.fields.description.hint')}
      >
        <Textarea
          minRows={4}
          placeholder={t('create.fields.description.placeholder')}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description')}
        />
      </Field>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3 }}>
        <Button type="submit" loading={create.isPending}>
          {t('create.submit')}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCampaignPage;
