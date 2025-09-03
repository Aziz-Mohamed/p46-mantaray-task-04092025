/**
 * Validation utility functions
 * Following clean code principles with single responsibility
 */

import { VALIDATION_RULES } from '../constants';

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns Object with isValid boolean and error message
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validates password strength
 * @param password - Password string to validate
 * @returns Object with isValid boolean and error message
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates name format
 * @param name - Name string to validate
 * @returns Object with isValid boolean and error message
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates password confirmation
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Object with isValid boolean and error message
 */
export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords don't match" };
  }
  
  return { isValid: true };
};

/**
 * Validates required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid boolean and error message
 */
export const validateRequired = (
  value: string, 
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

/**
 * Validates phone number format
 * @param phone - Phone number string to validate
 * @returns Object with isValid boolean and error message
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Basic phone validation (can be enhanced based on requirements)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};
