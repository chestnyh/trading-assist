import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import {
  authControllerLogin,
  authControllerLogout,
  authControllerMe,
  extractFieldToMessageFromValidationError,
  isValidationError,
} from '@trading-bot/api-client';

interface User {
  id: number;
  email: string;
  nickname: string;
  name?: string;
  role?: string;
  country?: string;
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CHANNEL_NAME = 'trading-bot-auth';
const LEGACY_STORAGE_KEYS = ['auth_token', 'user_data'];

const clearLegacyStorage = (): void => {
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Storage can be unavailable; the credential is no longer stored there regardless.
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const response = await authControllerMe();
      if ('status' in response && response.status === 200 && 'data' in response) {
        setUser(response.data as unknown as User);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // FR-014: stale credentials from the previous mechanism must never be trusted again.
    clearLegacyStorage();

    let active = true;
    void (async () => {
      try {
        const response = await authControllerMe();
        if (active && 'status' in response && response.status === 200 && 'data' in response) {
          setUser(response.data as unknown as User);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') {
      return;
    }

    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'logout') {
        setUser(null);
      } else if (event.data?.type === 'login') {
        void refreshSession();
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [refreshSession]);

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<LoginResult> => {
    try {
      const loginData = {
        email,
        password,
        ...(rememberMe && { rememberMe }),
      } as Parameters<typeof authControllerLogin>[0];

      const response = await authControllerLogin(loginData);

      if (
        'status' in response &&
        response.status === 200 &&
        'data' in response &&
        response.data &&
        'user' in response.data
      ) {
        setUser(response.data.user as unknown as User);
        channelRef.current?.postMessage({ type: 'login' });
        return { success: true };
      }

      if ('status' in response && response.status === 401) {
        return { success: false, error: "Invalid credentials" };
      }

      if ('status' in response && response.status === 400) {
        return {
          success: false,
          error:
            "Please verify your email address before logging in. Check your email for the verification code.",
        };
      }

      return { success: false, error: "Unexpected response format from server" };
    } catch (caughtError: unknown) {
      let errorMessage = "Login failed. Please try again.";

      // api-client request validation errors (Zod issues)
      const validationErrors = isValidationError(caughtError)
        ? extractFieldToMessageFromValidationError(caughtError)
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

      if (caughtError && typeof caughtError === "object") {
        if ("isNetworkError" in caughtError && (caughtError as { isNetworkError?: boolean }).isNetworkError) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
          return { success: false, error: errorMessage };
        }

        const message =
          "message" in caughtError && typeof (caughtError as any).message === 'string'
            ? String((caughtError as any).message)
            : undefined;
        if (message) {

          if (message === "Failed to fetch" || message.includes("fetch")) {
            errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
          } else {
            errorMessage = message;
          }
        } else if ("status" in caughtError) {
          const status = (caughtError as { status: number }).status;
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
      } else if (caughtError instanceof TypeError && caughtError.message === "Failed to fetch") {
        errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authControllerLogout();
    } catch {
      // Sign-out is best effort; the local state is cleared regardless.
    }

    setUser(null);
    channelRef.current?.postMessage({ type: 'logout' });
  }, []);

 

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
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
