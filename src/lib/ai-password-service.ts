
import { PasswordStrength, analyzePasswordStrength } from './password-utils';
import { calculateEntropyBits, calculateTimeToCrack } from './hash-utils';

export interface AiPasswordAnalysis {
  strength: PasswordStrength;
  entropyBits: number;
  timeToCrack: string;
  vulnerabilities: string[];
  suggestion: string;
  isBreached: boolean;
}

// Common password patterns to check
const commonPatterns = [
  { pattern: /^123456/, message: "Sequential numbers" },
  { pattern: /^password/i, message: "Common dictionary word ('password')" },
  { pattern: /^qwerty/i, message: "Keyboard pattern" },
  { pattern: /^admin/i, message: "Default admin credential" },
  { pattern: /123$/, message: "Ends with simple number sequence" },
  { pattern: /abc/i, message: "Alphabet sequence" },
  { pattern: /(.)\1{2,}/, message: "Repeated characters" },
  { pattern: /^[0-9]+$/, message: "Only numbers" },
  { pattern: /^[a-zA-Z]+$/, message: "Only letters" },
  { pattern: /^[a-z]+$/, message: "Only lowercase letters" },
  { pattern: /^[A-Z]+$/, message: "Only uppercase letters" },
  { pattern: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, message: "Month name" },
  { pattern: /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, message: "Day of week" },
  { pattern: /19\d\d|20\d\d/, message: "Common year" },
];

// Common leaked passwords dataset (abbreviated list - would be much larger in production)
const breachedPasswords = [
  "123456", "password", "123456789", "12345678", "12345", "qwerty", 
  "1234567", "111111", "1234567890", "123123", "abc123", "1234", 
  "password1", "iloveyou", "1q2w3e4r", "000000", "qwerty123", 
  "zaq12wsx", "dragon", "sunshine", "princess", "letmein", "654321", 
  "monkey", "27653", "1qaz2wsx", "123321", "qwertyuiop", "superman",
  "asdfghjkl"
];

// Simulate AI password analysis using rules-based logic
export function analyzePasswordWithAI(password: string): AiPasswordAnalysis {
  // Analyze basic strength
  const strength = analyzePasswordStrength(password);
  
  // Calculate entropy bits
  const entropyBits = calculateEntropyBits(password);
  
  // Calculate time to crack
  const { readableTime } = calculateTimeToCrack(password, strength);
  
  // Check for common vulnerabilities
  const vulnerabilities = findVulnerabilities(password);
  
  // Check if password is in a breach database
  const isBreached = checkIfBreached(password);
  
  // Generate AI-like suggestion
  const suggestion = generatePasswordSuggestion(password, strength, vulnerabilities);
  
  return {
    strength,
    entropyBits,
    timeToCrack: readableTime,
    vulnerabilities,
    suggestion,
    isBreached
  };
}

function findVulnerabilities(password: string): string[] {
  const vulnerabilities: string[] = [];
  
  // Check password length
  if (password.length < 8) {
    vulnerabilities.push("Password is too short (less than 8 characters)");
  }
  
  // Check character variety
  if (!/[A-Z]/.test(password)) {
    vulnerabilities.push("Missing uppercase letters");
  }
  
  if (!/[a-z]/.test(password)) {
    vulnerabilities.push("Missing lowercase letters");
  }
  
  if (!/[0-9]/.test(password)) {
    vulnerabilities.push("Missing numbers");
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    vulnerabilities.push("Missing special characters");
  }
  
  // Check for common patterns
  for (const { pattern, message } of commonPatterns) {
    if (pattern.test(password)) {
      vulnerabilities.push(message);
      break; // Only add the first matching pattern to avoid overwhelming the user
    }
  }
  
  // Check if it's a common password but not in our breach database
  // This simulates having a larger list of weak but not necessarily breached passwords
  const lowerPassword = password.toLowerCase();
  if (["welcome", "football", "baseball", "master", "access", "login"].includes(lowerPassword)) {
    vulnerabilities.push("Commonly used password");
  }

  return vulnerabilities;
}

function checkIfBreached(password: string): boolean {
  return breachedPasswords.includes(password.toLowerCase());
}

function generatePasswordSuggestion(password: string, strength: PasswordStrength, vulnerabilities: string[]): string {
  // If the password is already strong, no need for suggestions
  if (strength === PasswordStrength.VeryStrong) {
    return "Your password is already strong!";
  }
  
  if (vulnerabilities.length === 0 && strength >= PasswordStrength.Strong) {
    return "Your password is already strong!";
  }
  
  // Create a basic improved password suggestion
  let improvedPassword = password;
  
  // If it's too short, add some complexity
  if (password.length < 12) {
    // Make sure it has 12+ chars
    while (improvedPassword.length < 12) {
      const randChar = getRandomChar();
      // Insert at random position
      const position = Math.floor(Math.random() * (improvedPassword.length + 1));
      improvedPassword = improvedPassword.slice(0, position) + randChar + improvedPassword.slice(position);
    }
  }
  
  // Ensure it has uppercase
  if (!/[A-Z]/.test(improvedPassword)) {
    improvedPassword = insertRandomChar(improvedPassword, getRandomUppercase());
  }
  
  // Ensure it has lowercase
  if (!/[a-z]/.test(improvedPassword)) {
    improvedPassword = insertRandomChar(improvedPassword, getRandomLowercase());
  }
  
  // Ensure it has numbers
  if (!/[0-9]/.test(improvedPassword)) {
    improvedPassword = insertRandomChar(improvedPassword, getRandomNumber());
  }
  
  // Ensure it has special chars
  if (!/[^A-Za-z0-9]/.test(improvedPassword)) {
    improvedPassword = insertRandomChar(improvedPassword, getRandomSymbol());
  }
  
  // If the password is still not very strong, add more complexity
  if (analyzePasswordStrength(improvedPassword) < PasswordStrength.VeryStrong) {
    improvedPassword += getRandomChar() + getRandomChar() + getRandomChar();
  }
  
  return improvedPassword;
}

// Helper functions for password suggestion
function getRandomChar(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function getRandomUppercase(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function getRandomLowercase(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function getRandomNumber(): string {
  const chars = "0123456789";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function getRandomSymbol(): string {
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function insertRandomChar(str: string, char: string): string {
  const position = Math.floor(Math.random() * (str.length + 1));
  return str.slice(0, position) + char + str.slice(position);
}
