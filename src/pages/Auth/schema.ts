import * as yup from 'yup';

const email = yup
  .string()
  .trim()
  .required('Enter your email')
  .email('Invalid email address');

const password = yup
  .string()
  .required('Enter your password')
  .min(8, 'At least 8 characters');

export const loginSchema = yup.object({
  email,
  password: yup.string().required('Enter your password'),
});

const optionalName = yup
  .string()
  .trim()
  .max(50, 'At most 50 characters')
  .optional()
  .transform((value: string) => value || undefined);

export const registerSchema = yup.object({
  workspaceName: yup
    .string()
    .trim()
    .required('Enter a workspace name')
    .min(2, 'At least 2 characters'),
  firstName: optionalName,
  lastName: optionalName,
  email,
  password,
  confirmPassword: yup
    .string()
    .required('Repeat your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
