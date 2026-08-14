import { render, screen } from '@testing-library/react';
import App from '../app';

function seedAuthenticatedSession() {
  window.localStorage.setItem('auth_token', 'test-token');
  window.localStorage.setItem(
    'user_data',
    JSON.stringify({ id: 1, email: 'trader@example.com', nickname: 'trader' })
  );
}

// AuthRoute gates the sign-in, sign-up, and restore-password routes: an
// authenticated user visiting any of them is redirected to /dashboard.
describe('AuthRoute (auth-only routes redirect authenticated users)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it.each(['/sign-in', '/sign-up', '/restore-password'])(
    'redirects an authenticated user away from %s to /dashboard',
    (path) => {
      seedAuthenticatedSession();
      window.history.pushState({}, '', path);
      render(<App />);

      // The Dashboard renders (route content + sidebar Dashboard link)
      expect(
        screen.getByRole('link', { name: 'Dashboard' })
      ).toBeInTheDocument();
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    }
  );

  it('renders the sign-up form for an unauthenticated user', () => {
    window.history.pushState({}, '', '/sign-up');
    render(<App />);

    expect(
      screen.getByText(/Let's start!/i)
    ).toBeInTheDocument();
  });

  it('shows the NotFound page for an unknown path when authenticated', () => {
    seedAuthenticatedSession();
    window.history.pushState({}, '', '/some/unknown/path');
    render(<App />);

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Go to Dashboard/i })
    ).toBeInTheDocument();
  });

  it('redirects an unauthenticated user on an unknown path to sign-in', () => {
    window.history.pushState({}, '', '/some/unknown/path');
    render(<App />);

    expect(
      screen.getByText(/Sign In Into Your Account/i)
    ).toBeInTheDocument();
  });
});
