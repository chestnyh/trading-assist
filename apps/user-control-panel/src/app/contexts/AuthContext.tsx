import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  authControllerLogin,
  extractFieldToMessageFromValidationError,
  isValidationError,
} from '@trading-bot/api-client';

interface User {
  id: number;
  email: string;
  nickname: string;
  name?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResult>;
  signUp: (email: string, password: string, name: string, nickname: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<LoginResult> => {
    try {
      const loginData = {
        email,
        password,
        ...(rememberMe && { rememberMe }),
      } as Parameters<typeof authControllerLogin>[0];

      const response = await authControllerLogin(loginData);

      let access_token: string | undefined;
      let userData: User | undefined;

      if ('status' in response && (response.status === 200 || (response.status as number) === 201) && 'data' in response && response.data) {
        access_token = response.data.access_token;
        userData = response.data.user as unknown as User;
      } else if ('access_token' in response && 'user' in response && typeof response === 'object' && response !== null) {
        const directResponse = response as unknown as { access_token: string; user: User };
        access_token = directResponse.access_token;
        userData = directResponse.user;
      } else if ('status' in response && response.status === 401) {
        return { success: false, error: "Invalid credentials" };
      } else {
        return { success: false, error: "Unexpected response format from server" };
      }

      if (access_token && userData) {
        setToken(access_token);
        setUser(userData);

        if (rememberMe) {
          localStorage.setItem('auth_token', access_token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user_data');
        } else {
          sessionStorage.setItem('auth_token', access_token);
          sessionStorage.setItem('user_data', JSON.stringify(userData));
          // Clear localStorage in case it was used previously
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }

        return { success: true };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      const error = err as Error;
      let errorMessage = "Login failed. Please try again.";

      // api-client request validation errors (Zod issues)
      const validationErrors = isValidationError(error)
        ? extractFieldToMessageFromValidationError(error)
        : {};
      if (Object.keys(validationErrors).length > 0) {
        const fieldErrors: LoginResult['fieldErrors'] = {};

        if (validationErrors.email && !fieldErrors.email) fieldErrors.email = validationErrors.email;
        if (validationErrors.password && !fieldErrors.password) fieldErrors.password = validationErrors.password;

        return {
          success: false,
          error: errorMessage,
          fieldErrors,
        };
      }

      if (error && typeof error === "object") {
        if ("isNetworkError" in error && (error as { isNetworkError?: boolean }).isNetworkError) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
          return { success: false, error: errorMessage };
        }

        const message = typeof error.message === 'string' ? error.message : undefined;
        if (message) {

          if (message === "Failed to fetch" || message.includes("fetch")) {
            errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
          } else {
            errorMessage = message;
          }
        } else if ("status" in error) {
          const status = (error as { status: number }).status;
          if (status === 0) {
            errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
          } else 
          if (status === 400) {
            errorMessage = "Please verify your email address before logging in. Check your email for the verification code.";
          } else if (status === 401) {
            errorMessage = "Invalid credentials";
          } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
          }
        }
      } else if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
  };

  const signUp = async (email: string, password: string, name: string, nickname: string): Promise<boolean> => {
    try {
      // Call your API sign up endpoint
      const response = await fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, nickname }),
      });
      setIsLoading(true);

      if (response.ok) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!token,
    isLoading,
    login,
    signUp,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
