import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  const setup = () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/unknown-page']}>
        <Routes>
          <Route path="/unknown-page" element={<NotFound />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    return { user };
  };

  it('renders the 404 heading and message', () => {
    setup();

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Page Not Found/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The page you are looking for doesn't exist or has been moved/i)
    ).toBeInTheDocument();
  });

  it('renders the "Go to Dashboard" button', () => {
    setup();

    expect(
      screen.getByRole('button', { name: /Go to Dashboard/i })
    ).toBeInTheDocument();
  });

  it('navigates to the dashboard when "Go to Dashboard" is clicked', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /Go to Dashboard/i }));

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
  });
});
