import { render, screen } from '@testing-library/react';
import App from '../../app/app';

// Seed an authenticated session exactly like AuthContext restores it:
// token + user data in localStorage -> isAuthenticated = true after mount.
function seedAuthenticatedSession() {
  window.localStorage.setItem(
    'auth_token',
    'test-token'
  );
  window.localStorage.setItem(
    'user_data',
    JSON.stringify({ id: 1, email: 'trader@example.com', nickname: 'trader' })
  );
}

describe('Dashboard (features/dashboard)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('renders the Dashboard component', () => {
    seedAuthenticatedSession();
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    // "Dashboard" appears in the sidebar nav and the Dashboard component
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    // The Dashboard route content itself renders
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders the app chrome around the Dashboard for an authorized user', () => {
    seedAuthenticatedSession();
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    // Sidebar navigation (only rendered when authenticated)
    expect(
      screen.getByRole('link', { name: 'Dashboard' })
    ).toBeInTheDocument();
    // "Rules" appears twice: sidebar + Management collapse group
    expect(screen.getAllByRole('link', { name: 'Rules' }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getByRole('link', { name: 'Settings' })
    ).toBeInTheDocument();

    // Header (user menu for an authenticated user) and Footer
    expect(
      screen.getByRole('button', { name: /User menu/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });
});
