import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import UserMenuButton from './UserMenuButton';
import { TypewriterText } from '../TypewriterText';
import { ThemeToggle } from './ThemeToggle';
import { UserAvatar } from '../avatar/UserAvatar';
import { AuthProvider } from '../../../app/contexts/AuthContext';

describe('UserMenuButton', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem(
      'user_data',
      JSON.stringify({ id: 1, email: 'user@example.com', nickname: 'nick', name: 'Full Name' })
    );
    window.localStorage.setItem('auth_token', 'token');
  });

  const setup = async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <UserMenuButton />
        </AuthProvider>
      </MemoryRouter>
    );
    // Wait for auth to load
    await screen.findByRole('button', { name: /User menu/i });
    return { user };
  };

  it('opens the dropdown with user info and logout', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /User menu/i }));

    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /User menu/i }));
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  it('logs out and navigates to sign-in', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /User menu/i }));
    await user.click(screen.getByRole('button', { name: /Logout/i }));

    expect(window.localStorage.getItem('auth_token')).toBeNull();
  });
});

describe('TypewriterText', () => {
  it('renders the full text in test environment', () => {
    render(<TypewriterText text="Ready to trade?" speed={10} />);
    expect(screen.getByText('Ready to trade?')).toBeInTheDocument();
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  it('toggles between dark and light mode', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /Switch to dark mode/i });
    await user.click(button);

    expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });
});

describe('UserAvatar', () => {
  it('renders initials for a two-part name', () => {
    render(<UserAvatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials for a single-part name', () => {
    render(<UserAvatar name="john" />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('renders a fallback icon without a name', () => {
    const { container } = render(<UserAvatar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the image when src is provided', () => {
    render(<UserAvatar src="avatar.png" alt="User avatar" name="John" />);
    expect(screen.getByAltText('User avatar')).toHaveAttribute('src', 'avatar.png');
  });
});
