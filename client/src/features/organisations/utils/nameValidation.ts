// The error to show under a name field, or null when the name is valid.
export const nameValidationError = (name: string): string | null => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 'This field is required';
  }
  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
};
