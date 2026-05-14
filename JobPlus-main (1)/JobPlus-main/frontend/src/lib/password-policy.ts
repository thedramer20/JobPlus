export interface PasswordPolicyResult {
  valid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export const MIN_PASSWORD_LENGTH = 8;

export function validatePasswordPolicy(value: string): PasswordPolicyResult {
  const hasMinLength = value.length >= MIN_PASSWORD_LENGTH;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);

  return {
    valid: hasMinLength && hasUppercase && hasLowercase && hasNumber,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber
  };
}
