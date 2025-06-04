import { useContext } from 'react';
import { UserContext, type UserContextType } from './UserContext';

interface User {
  name: string;
  avatar: string;
}

interface UserContext {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de <UserProvider>");
  }
  return context;
};