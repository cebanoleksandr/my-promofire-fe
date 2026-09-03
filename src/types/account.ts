export interface AccountProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  // Назва компанії користувача, спільна для всіх воркспейсів
  company: string | null;
  // firstName + lastName, або email як фолбек, якщо ім'я не заповнене
  displayName: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  company?: string;
}
