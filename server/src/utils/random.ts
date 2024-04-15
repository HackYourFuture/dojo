import crypto from 'crypto';

export const genId = () => {
  // Generates a random 8-character alphanumeric string
  return crypto.randomBytes(20)
    .toString('base64')
    .replace(/[/+=]/g, '')
    .slice(0,8);
}
