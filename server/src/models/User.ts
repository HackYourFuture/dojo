export interface User {
  readonly id: string;
  email: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly imageUrl?: string;
}