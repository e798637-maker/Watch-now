import React, { createContext, useState, useCallback, ReactNode } from 'react';
import apiClient from '../api/client';

export interface IUser {
  id: string;
  email: string;
  username: string;
}

export interface IProfile {
  id: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: IUser | null;
  profiles: IProfile[];
  currentProfile: IProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  switchProfile: (profileId: string) => Promise<void>;
  updateProfile: (profileId: string, name: string, avatar: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<IProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token: newToken, user: newUser, profiles: userProfiles } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    setProfiles(userProfiles);
    setCurrentProfile(userProfiles[0]);
  }, []);

  const register = useCallback(async (email: string, password: string, username: string) => {
    await apiClient.post('/auth/register', { email, password, username });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfiles([]);
    setCurrentProfile(null);
  }, []);

  const switchProfile = useCallback(async (profileId: string) => {
    const response = await apiClient.post(`/profiles/switch/${profileId}`, { userId: user?.id });
    const { token: newToken } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);

    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
    }
  }, [user, profiles]);

  const updateProfile = useCallback(
    async (profileId: string, name: string, avatar: string) => {
      await apiClient.put(`/profiles/${profileId}`, { name, avatar });

      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, name, avatar } : p))
      );

      if (currentProfile?.id === profileId) {
        setCurrentProfile({ ...currentProfile, name, avatar });
      }
    },
    [currentProfile]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profiles,
        currentProfile,
        token,
        login,
        register,
        logout,
        switchProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
