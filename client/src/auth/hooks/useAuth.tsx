import { createContext, useContext } from 'react';
import { User } from './User';

export interface AuthContextType {
  user: User | null;
  errorMessage: string;
  login: () => void;
  logout: () => Promise<void>;
}

export const ApiContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useAuth must be used within an ApiProvider');
  }

  return context;
};
