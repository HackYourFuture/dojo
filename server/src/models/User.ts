export interface User {
  readonly id: string;
  email: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}
