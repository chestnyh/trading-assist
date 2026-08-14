import { render, screen } from '@testing-library/react';
import App from '../../app/app';

// The App providers render Header (with AuthButton) and PagesLayout for the
// unauthenticated Main page. Main is public — it renders for everyone.
describe('MainPage routing (auth behavior)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('renders Main for unauthenticated users on the root path', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /Unlock Your Coding Potential/i })
    ).toBeInTheDocument();
    // Unauthenticated header shows the Sign In button (not the user menu)
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument();
  });

  it('renders Main on the /main path for unauthenticated users', async () => {
    window.history.pushState({}, '', '/main');
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /Unlock Your Coding Potential/i })
    ).toBeInTheDocument();
  });

  it('redirects unauthenticated users away from the protected dashboard to sign-in', async () => {
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    expect(
      await screen.findByText(/Sign In Into Your Account/i)
    ).toBeInTheDocument();
  });
});
