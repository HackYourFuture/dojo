import { UserRequest, UserResponse } from './types';

import { User } from '../models/user';

export const mapUserToDomain = (user: UserResponse): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    thumbnailUrl: user.thumbnailUrl,
    isActive: user.isActive,
  };
};

export const mapDomainToUserRequest = (user: User): UserRequest => {
  return {
    email: user.email,
    name: user.name,
    isActive: user.isActive,
  };
};
