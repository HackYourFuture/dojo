export interface UserRequest {
  email: string;
  name: string;
  isActive: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
}
