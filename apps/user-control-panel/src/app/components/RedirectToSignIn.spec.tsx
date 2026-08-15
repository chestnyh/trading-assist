import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RedirectToSignIn } from './RedirectToSignIn';

const setup = () => {
    render(
        <MemoryRouter
            initialEntries={['/some/unknown/path']}
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route path="*" element={<RedirectToSignIn />} />
                <Route path="/sign-in" element={<div>Sign In Form</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('RedirectToSignIn', () => {
    it('redirects to /sign-in', () => {
        setup();
        expect(screen.getByText('Sign In Form')).toBeInTheDocument();
    });
});
