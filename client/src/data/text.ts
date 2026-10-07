export const FIELD_REQUIRED_ERROR = 'This field is required';

// Empty or only spaces.
const isBlank = (value: unknown) => typeof value === 'string' && value.trim() === '';

// A copy of a request with blank text as null, as the API rejects empty text for most fields.
export const blankFieldsToNull = <Request extends object>(request: Request): Request => {
  const entries = Object.entries(request).map(([field, value]) => [field, isBlank(value) ? null : value]);
  return Object.fromEntries(entries) as Request;
};

// The error to show under a name field, or null when the name is valid.
export const nameValidationError = (name: string): string | null => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return FIELD_REQUIRED_ERROR;
  }
  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
};

// A single @ with text before it, a dot inside the domain after it, and no spaces.
const isValidEmail = (email: string) => {
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0] === '' || email.includes(' ')) {
    return false;
  }
  const dotIndex = parts[1].indexOf('.');
  return dotIndex > 0 && dotIndex < parts[1].length - 1;
};

// The error to show under an email field, or null when the email is valid. The server trims it.
export const emailValidationError = (email: string): string | null => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return FIELD_REQUIRED_ERROR;
  }
  if (!isValidEmail(trimmedEmail)) {
    return 'Email must be of format name@domain.com';
  }
  return null;
};

// The text with spaces for dashes and a capital first letter, so "in-progress" becomes "In progress".
// TODO: rename this function
export const formatTextToFriendly = (value: string): string => {
  const text = value.split('-').join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};
