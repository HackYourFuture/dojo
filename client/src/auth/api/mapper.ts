import { SessionResponse } from './types';
import { User } from '../hooks/User';

export const mapSessionToDomain = (session: SessionResponse): User => {
  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    pictureUrl: session.pictureUrl,
  };
};
