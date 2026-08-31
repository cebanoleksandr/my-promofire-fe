export interface AccountProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  // firstName+lastName, либо email как фолбэк, если имя не заполнено
  displayName: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
}
