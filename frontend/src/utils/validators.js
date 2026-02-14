/**
 * Validator Utilities
 * Form validation functions
 */

import { PASSWORD_REQUIREMENTS } from './constants';

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// Password validation
export const validatePassword = (password) => {
  const { MIN_LENGTH, REQUIRE_UPPERCASE, REQUIRE_LOWERCASE, REQUIRE_NUMBERS, REQUIRE_SPECIAL_CHARS } =
    PASSWORD_REQUIREMENTS;

  if (!password) {
    return 'Password is required';
  }

  if (password.length < MIN_LENGTH) {
    return `Password must be at least ${MIN_LENGTH} characters long`;
  }

  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (REQUIRE_NUMBERS && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }

  if (REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  return '';
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return '';
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return 'Username is required';
  }

  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }

  return '';
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return `${fieldName} is required`;
  }

  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }

  if (name.length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }

  return '';
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

  if (!phone) {
    return 'Phone number is required';
  }

  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }

  return '';
};

// Street address validation
export const validateStreet = (street) => {
  if (!street) {
    return 'Street address is required';
  }

  if (street.length < 5) {
    return 'Street address must be at least 5 characters';
  }

  if (street.length > 100) {
    return 'Street address must not exceed 100 characters';
  }

  return '';
};

// City validation
export const validateCity = (city) => {
  if (!city) {
    return 'City is required';
  }

  if (city.length < 2) {
    return 'City must be at least 2 characters';
  }

  if (city.length > 50) {
    return 'City must not exceed 50 characters';
  }

  return '';
};

// State/Province validation
export const validateState = (state) => {
  if (!state) {
    return 'State/Province is required';
  }

  return '';
};

// ZIP code validation
export const validateZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  if (!zipCode) {
    return 'ZIP code is required';
  }

  if (!zipRegex.test(zipCode)) {
    return 'Please enter a valid ZIP code';
  }

  return '';
};

// Country validation
export const validateCountry = (country) => {
  if (!country) {
    return 'Country is required';
  }

  return '';
};

// URL validation
export const validateUrl = (url) => {
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

// Number validation
export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);

  if (isNaN(num)) {
    return 'Must be a number';
  }

  if (num < min) {
    return `Must be at least ${min}`;
  }

  if (num > max) {
    return `Must not exceed ${max}`;
  }

  return '';
};

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }

  return '';
};

// File validation
export const validateFile = (file, maxSizeMB = 5, allowedTypes = []) => {
  if (!file) {
    return 'File is required';
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }

  return '';
};

// Generic field validator - combines multiple validation rules
export const validateField = (name, value, rules = {}) => {
  const validationFunctions = {
    email: () => validateEmail(value),
    password: () => validatePassword(value),
    confirmPassword: () => validateConfirmPassword(rules.password, value),
    username: () => validateUsername(value),
    firstName: () => validateName(value, 'First name'),
    lastName: () => validateName(value, 'Last name'),
    phone: () => validatePhone(value),
    street: () => validateStreet(value),
    city: () => validateCity(value),
    state: () => validateState(value),
    zipCode: () => validateZipCode(value),
    country: () => validateCountry(value),
    url: () => validateUrl(value),
    required: () => validateRequired(value, rules.fieldName),
  };

  if (validationFunctions[name]) {
    return validationFunctions[name]();
  }

  // Check for min/max rules
  if (rules.type === 'number') {
    return validateNumber(value, rules.min, rules.max);
  }

  return '';
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
  validateName,
  validatePhone,
  validateStreet,
  validateCity,
  validateState,
  validateZipCode,
  validateCountry,
  validateUrl,
  validateNumber,
  validateRequired,
  validateFile,
  validateField,
};
