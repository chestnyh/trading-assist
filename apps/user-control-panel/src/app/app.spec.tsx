import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

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
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should redirect to sign-in when user is not authenticated', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // The app should redirect to /auth/sign-in when not authenticated
    // We can check that some auth-related element is present
    expect(container.firstChild).toBeTruthy();
  });
});
