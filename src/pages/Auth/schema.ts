import * as yup from 'yup';
import type { TFunction } from 'i18next';

// Схемы валидации строятся фабричными функциями, чтобы сообщения об
// ошибках можно было перевести через react-i18next (t передаётся из
// компонента, где вызывается useTranslation).

export const getLoginSchema = (t: TFunction<'auth'>) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: yup.string().required(t('validation.passwordRequired')),
  });

export const getRegisterSchema = (t: TFunction<'auth'>) => {
  const email = yup
    .string()
    .trim()
    .required(t('validation.emailRequired'))
    .email(t('validation.emailInvalid'));

  const password = yup
    .string()
    .required(t('validation.passwordRequired'))
    .min(8, t('validation.passwordMin'));

  const optionalName = yup
    .string()
    .trim()
    .max(50, t('validation.nameMax'))
    .optional()
    .transform((value: string) => value || undefined);

  return yup.object({
    workspaceName: yup
      .string()
      .trim()
      .required(t('validation.workspaceNameRequired'))
      .min(2, t('validation.workspaceNameMin')),
    firstName: optionalName,
    lastName: optionalName,
    email,
    password,
    confirmPassword: yup
      .string()
      .required(t('validation.confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('validation.passwordsMismatch')),
  });
};

export const getAcceptInviteSchema = (t: TFunction<'auth'>) => {
  const password = yup
    .string()
    .required(t('validation.passwordRequired'))
    .min(8, t('validation.passwordMin'));

  return yup.object({
    password,
    confirmPassword: yup
      .string()
      .required(t('validation.confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('validation.passwordsMismatch')),
  });
};

export type LoginFormValues = yup.InferType<ReturnType<typeof getLoginSchema>>;
export type RegisterFormValues = yup.InferType<ReturnType<typeof getRegisterSchema>>;
export type AcceptInviteFormValues = yup.InferType<
  ReturnType<typeof getAcceptInviteSchema>
>;
