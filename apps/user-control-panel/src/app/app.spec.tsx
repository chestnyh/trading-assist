import { render } from '@testing-library/react';

import App from './app';

// Mock the AuthContext to provide a default authenticated state
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
    token: null,
  }),
}));

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });
})
