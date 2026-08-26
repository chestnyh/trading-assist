import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
    it('renders the Dashboard heading', () => {
        render(<Dashboard />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
});
