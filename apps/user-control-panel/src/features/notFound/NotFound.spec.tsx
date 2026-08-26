import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotFound } from './NotFound';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('NotFound', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the 404 heading', () => {
        render(<NotFound />);
        expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    });

    it('renders "Page Not Found" title and description', () => {
        render(<NotFound />);
        expect(
            screen.getByRole('heading', { name: /page not found/i })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/the page you are looking for doesn't exist or has been moved/i)
        ).toBeInTheDocument();
    });

    it('navigates to /dashboard when "Go to Dashboard" is clicked', async () => {
        const user = userEvent.setup();
        render(<NotFound />);

        const dashboardButton = screen.getByRole('button', { name: /go to dashboard/i });
        await user.click(dashboardButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});
