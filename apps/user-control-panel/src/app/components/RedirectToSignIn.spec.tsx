import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RedirectToSignIn } from './RedirectToSignIn';

describe('RedirectToSignIn', () => {
  const setup = () =>
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Routes>
          <Route path="/unknown" element={<RedirectToSignIn />} />
          <Route path="/sign-in" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  it('redirects to /sign-in', () => {
    setup();

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });
});
