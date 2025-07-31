import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

import { AuthService } from '@/Services/AuthService';
import { AuthContextType, LoginResponseDto, User, RegisterDto, RegisterResponseDto } from '@/Models';
import { ApiResponse } from '@/Models/api';
import { ApiError } from '@/Services/apiService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with true for initial load

  // Load saved auth state from cookies on first render
  useEffect(() => {
    const savedToken = Cookies.get('accessToken');
    const savedUser = Cookies.get('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse user from cookies:', err);
        // Clear corrupted cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
      }
    }

    setIsLoading(false);
  }, []);

 const login = async (email: string, password: string): Promise<void> => {
  setIsLoading(true);
  try {
    const response = await AuthService.login({ email, password });
    console.log('Login response:', response);

    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }

    // Handle case sensitivity
    const accessToken = response.data?.accessToken || response.data?.AccessToken;
    const refreshToken = response.data?.refreshToken || response.data?.RefreshToken;

    if (!accessToken) {
      throw new Error('Invalid login response - no access token received');
    }

    // Extract user data with fallbacks
    const userData = response.data;
    const user: User = {
      id: userData.userId || userData.UserId || undefined, // Will be undefined if null
      name: userData.userName || userData.UserName || 'Unknown',
      email: userData.email || userData.Email || '',
      role: userData.userRole || userData.UserRole || 'user',
      profileImageUrl: userData.profileImageUrl || userData.ProfileImageUrl,
      isProfileComplete: userData.isProfileComplete || false,
      createdAt: userData.createdAt || userData.CreatedAt || new Date().toISOString()
    };

    // If you absolutely need an ID, generate a temporary one
    if (!user.id) {
      user.id = `temp-${Date.now()}`;
      console.warn('No user ID received from server, using temporary ID');
    }

    setToken(accessToken);
    setUser(user);

    // Set cookies
    Cookies.set('accessToken', accessToken, { 
      expires: 1, 
      secure: true, 
      sameSite: 'strict' 
    });
    
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
    }
    
    Cookies.set('user', JSON.stringify(user), { 
      expires: 7, 
      secure: true, 
      sameSite: 'strict' 
    });

  } catch (error: any) {
    console.error('Login failed:', error);
    setUser(null);
    setToken(null);
    throw new Error(error.message || 'Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const register = async (data: RegisterDto): Promise<RegisterResponseDto> => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(data);

    if (response.success) {
      console.log('Registration successful:', response.message);
    }
    
    return response;
    } catch (error: unknown) {
      console.error('Registration error in AuthContext:', error);
      
      if (error instanceof ApiError) {
        // Log detailed error information for debugging
        console.error('ApiError details:', {
          statusCode: error.statusCode,
          message: error.message,
          errors: error.errors
        });

        // Re-throw the ApiError so the component can handle field-specific errors
        throw error;
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error('An unexpected error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    const userId = user?.id;
    const refreshToken = Cookies.get('refreshToken');

    // Clear local state immediately for better UX
    setUser(null);
    setToken(null);
    
    // Clear cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');

    // Attempt to logout on server (don't block the UI if it fails)
    if (userId && refreshToken) {
      try {
        await AuthService.logout(userId, refreshToken);
      } catch (error) {
        console.error('Server logout failed (this is not critical):', error);
        // Don't throw error here as local logout was successful
      }
    }
  };

  const refreshAuth = async (): Promise<void> => {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      // You might want to implement a refresh endpoint in your AuthService
      // const response = await AuthService.refreshToken(refreshToken);
      // Handle token refresh logic here
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    // You might want to add refreshAuth to your AuthContextType interface
    // refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};