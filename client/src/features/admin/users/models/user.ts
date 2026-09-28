export interface User {
  readonly id: string;
  name: string;
  email: string;
  thumbnailUrl: string | null;
  isActive: boolean;
}
