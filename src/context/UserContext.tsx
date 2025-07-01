'use client';

import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { getAccessToken, getCurrentUser } from '../utils/auth';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  accessToken: string | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useAuth = () => {
  const user = React.useContext(UserContext);
  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return user;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = getAccessToken();

    if (storedUser) {
      setUser(storedUser);
    }
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  return (
    <UserContext.Provider value={{ user, setUser, accessToken }}>{children}</UserContext.Provider>
  );
};
