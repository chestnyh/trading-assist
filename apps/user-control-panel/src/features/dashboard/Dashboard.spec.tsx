import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

let mockUser: { name?: string; nickname?: string } | null = null;

jest.mock('../../app/contexts/AuthContext', () => ({
    useAuth: () => ({ user: mockUser }),
}));

const renderDashboard = () =>
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );

describe('Dashboard', () => {
    beforeEach(() => {
        mockUser = null;
    });

    it('renders the Dashboard label', () => {
        renderDashboard();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('greets the user by name when it is known', () => {
        mockUser = { name: 'Alex' };
        renderDashboard();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome back, Alex');
    });

    it('links to creating a rule, the rules list and settings', () => {
        renderDashboard();
        expect(screen.getByRole('link', { name: /create a rule/i })).toHaveAttribute('href', '/rules/add');
        expect(screen.getByRole('link', { name: /^your rules/i })).toHaveAttribute('href', '/rules');
        expect(screen.getByRole('link', { name: /connect services/i })).toHaveAttribute('href', '/settings');
    });
});
