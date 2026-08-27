import type { Role } from './user';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AcceptInviteDto {
  token: string;
  password: string;
}

export interface InviteDto {
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
