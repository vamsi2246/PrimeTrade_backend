import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, loginWithGoogle, logoutUser } from '../api/authApi';
import { getUserProfile, updateUserProfile } from '../api/adminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await getUserProfile();
          const freshUser = res.data.user;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          console.error('Failed to restore session:', error);
          logoutStateClear();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth_expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth_expired', handleAuthExpired);
    };
  }, []);

  const logoutStateClear = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      const { user: loggedUser, accessToken } = res.data;
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setLoading(true);
    try {
      const res = await loginWithGoogle(idToken);
      const { user: loggedUser, accessToken } = res.data;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await registerUser(name, email, password);
      const { user: registeredUser, accessToken } = res.data;
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      logoutStateClear();
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await updateUserProfile(profileData);
      const updatedUser = res.data.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
