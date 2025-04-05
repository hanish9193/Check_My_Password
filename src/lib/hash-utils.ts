import * as bcrypt from 'bcryptjs';
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { PasswordStrength } from './password-utils';

export interface PasswordHashDetails {
  algorithm: 'bcrypt' | 'sha256';
  hash: string;
  salt?: string;
}

// Helper function to generate a salt
export function generateSalt(rounds = 10): string {
  return bcrypt.genSaltSync(rounds);
}

// Hash password with bcrypt
export function hashWithBcrypt(password: string, rounds = 10): PasswordHashDetails {
  const salt = generateSalt(rounds);
  const hash = bcrypt.hashSync(password, salt);
  
  return {
    algorithm: 'bcrypt',
    hash,
    salt
  };
}

// Hash password with SHA-256 using crypto-js instead of Node.js crypto
export function hashWithSHA256(password: string): PasswordHashDetails {
  const hash = sha256(password).toString(Hex);
  
  return {
    algorithm: 'sha256',
    hash
  };
}

// Verify password with bcrypt
export function verifyBcryptPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

// Calculate time to crack (in seconds) based on complexity and strength
export function calculateTimeToCrack(password: string, strength: PasswordStrength): {
  time: number;
  readableTime: string;
} {
  // Base cracking speeds (passwords per second)
  // These are estimated figures and would vary based on hardware
  const crackingSpeeds = {
    // Attempts per second on an average computer
    bruteForce: 10_000_000_000, // 10 billion attempts per second
  };
  
  // Character set sizes
  const characterSets = {
    lowercase: 26,
    uppercase: 26,
    numbers: 10,
    symbols: 33,
  };
  
  // Calculate the character set size based on the password content
  let charSetSize = 0;
  if (/[a-z]/.test(password)) charSetSize += characterSets.lowercase;
  if (/[A-Z]/.test(password)) charSetSize += characterSets.uppercase;
  if (/[0-9]/.test(password)) charSetSize += characterSets.numbers;
  if (/[^A-Za-z0-9]/.test(password)) charSetSize += characterSets.symbols;
  
  // If somehow no character set was identified, default to lowercase
  if (charSetSize === 0) charSetSize = characterSets.lowercase;
  
  // Calculate the total possible combinations
  const possibleCombinations = Math.pow(charSetSize, password.length);
  
  // Calculate the time to crack (in seconds)
  // On average, a brute force attack would need to check half the possible combinations
  const secondsToCrack = possibleCombinations / (2 * crackingSpeeds.bruteForce);
  
  // Convert to a readable format
  const readableTime = formatTimeToReadable(secondsToCrack);
  
  return {
    time: secondsToCrack,
    readableTime
  };
}

// Calculate entropy bits
export function calculateEntropyBits(password: string): number {
  // Calculate character set size
  let charSetSize = 0;
  if (/[a-z]/.test(password)) charSetSize += 26;
  if (/[A-Z]/.test(password)) charSetSize += 26;
  if (/[0-9]/.test(password)) charSetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charSetSize += 33;
  
  // If somehow no character set was identified, default to lowercase
  if (charSetSize === 0) charSetSize = 26;
  
  // Shannon entropy formula: E = L * log2(N)
  // Where L is the length of the password and N is the size of the character set
  return Math.round(password.length * (Math.log(charSetSize) / Math.log(2)));
}

function formatTimeToReadable(seconds: number): string {
  if (seconds < 1) {
    return 'instantly';
  }
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }
  if (seconds < 60 * 60) {
    return `${Math.round(seconds / 60)} minutes`;
  }
  if (seconds < 60 * 60 * 24) {
    return `${Math.round(seconds / (60 * 60))} hours`;
  }
  if (seconds < 60 * 60 * 24 * 30.44) {
    return `${Math.round(seconds / (60 * 60 * 24))} days`;
  }
  if (seconds < 60 * 60 * 24 * 365.24) {
    return `${Math.round(seconds / (60 * 60 * 24 * 30.44))} months`;
  }
  if (seconds < 60 * 60 * 24 * 365.24 * 100) {
    return `${Math.round(seconds / (60 * 60 * 24 * 365.24))} years`;
  }
  if (seconds < 60 * 60 * 24 * 365.24 * 1000) {
    return `${Math.round(seconds / (60 * 60 * 24 * 365.24 * 100))} centuries`;
  }
  if (seconds < 60 * 60 * 24 * 365.24 * 1000000) {
    return `${Math.round(seconds / (60 * 60 * 24 * 365.24 * 1000))} millennia`;
  }
  
  return 'millions of years';
}
