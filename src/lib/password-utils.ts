
export enum PasswordStrength {
  VeryWeak = 0,
  Weak = 1,
  Medium = 2,
  Strong = 3,
  VeryStrong = 4,
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface SavedPassword {
  id: string;
  name: string;
  password: string;
  strength: PasswordStrength;
  createdAt: string;
  notes?: string;
}

export function generatePassword(options: PasswordOptions): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let characters = '';
  let password = '';

  if (options.includeUppercase) characters += uppercaseChars;
  if (options.includeLowercase) characters += lowercaseChars;
  if (options.includeNumbers) characters += numberChars;
  if (options.includeSymbols) characters += symbolChars;

  // Ensure at least one character type is selected
  if (characters === '') {
    characters = lowercaseChars;
  }

  // Generate the password
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

export function analyzePasswordStrength(password: string): PasswordStrength {
  if (!password) return PasswordStrength.VeryWeak;
  
  // Calculate score based on various criteria
  let score = 0;
  
  // Length check
  if (password.length > 14) score += 2;
  else if (password.length >= 10) score += 1.5;
  else if (password.length >= 8) score += 1;
  else if (password.length >= 6) score += 0.5;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
  
  // Determine strength based on score
  if (score >= 3) return PasswordStrength.VeryStrong;
  if (score >= 2) return PasswordStrength.Strong;
  if (score >= 1.5) return PasswordStrength.Medium;
  if (score >= 1) return PasswordStrength.Weak;
  return PasswordStrength.VeryWeak;
}

export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.VeryStrong:
      return 'bg-success';
    case PasswordStrength.Strong:
      return 'bg-success/80';
    case PasswordStrength.Medium:
      return 'bg-info';
    case PasswordStrength.Weak:
      return 'bg-warning';
    case PasswordStrength.VeryWeak:
      return 'bg-destructive';
    default:
      return 'bg-gray-300';
  }
}

export function getStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.VeryStrong:
      return 'Very Strong';
    case PasswordStrength.Strong:
      return 'Strong';
    case PasswordStrength.Medium:
      return 'Medium';
    case PasswordStrength.Weak:
      return 'Weak';
    case PasswordStrength.VeryWeak:
      return 'Very Weak';
    default:
      return 'Unknown';
  }
}

export function savePassword(password: SavedPassword): void {
  const savedPasswords = getPasswords();
  savedPasswords.push(password);
  localStorage.setItem('saved_passwords', JSON.stringify(savedPasswords));
}

export function updatePassword(updatedPassword: SavedPassword): void {
  const savedPasswords = getPasswords();
  const index = savedPasswords.findIndex(p => p.id === updatedPassword.id);
  
  if (index !== -1) {
    savedPasswords[index] = updatedPassword;
    localStorage.setItem('saved_passwords', JSON.stringify(savedPasswords));
  }
}

export function deletePassword(id: string): void {
  const savedPasswords = getPasswords();
  const updatedPasswords = savedPasswords.filter(p => p.id !== id);
  localStorage.setItem('saved_passwords', JSON.stringify(updatedPasswords));
}

export function getPasswords(): SavedPassword[] {
  const passwordsJson = localStorage.getItem('saved_passwords');
  return passwordsJson ? JSON.parse(passwordsJson) : [];
}
