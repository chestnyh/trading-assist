import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Main } from './Main';

const renderMain = () =>
    render(
        <MemoryRouter>
            <Main />
        </MemoryRouter>
    );

describe('Main', () => {
    it('renders without crashing', () => {
        renderMain();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('links hero actions to sign-up and the how it works section', () => {
        renderMain();
        expect(screen.getByRole('link', { name: 'Get Started' })).toHaveAttribute('href', '/sign-up');
        expect(screen.getByRole('link', { name: 'See How It Works' })).toHaveAttribute('href', '#how-it-works');
    });

    it('renders the three how it works steps in order', () => {
        renderMain();
        const steps = within(screen.getByRole('heading', { name: 'How it works' }).closest('section') as HTMLElement)
            .getAllByRole('heading', { level: 3 })
            .map((heading) => heading.textContent);
        expect(steps).toEqual(['Connect your services', 'Create a rule', 'Let it run']);
    });

    it('lists the supported exchanges and notification channels', () => {
        renderMain();
        const section = screen.getByRole('heading', { name: 'Never miss a signal' }).closest('section') as HTMLElement;
        const channels = within(section).getByRole('list', { name: 'Notification channels' });
        expect(within(channels).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
            'Telegram',
            'Discord',
            'Slack',
            'Email',
            'SMS',
            'WhatsApp',
            'Push',
            'Webhooks',
        ]);
        const exchanges = within(section).getByRole('list', { name: 'Exchanges' });
        expect(within(exchanges).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
            'Binance',
            'Bybit',
            'Kraken',
        ]);
        expect(within(section).getByRole('link', { name: 'Set Up Alerts' })).toHaveAttribute('href', '/sign-up');
    });

    it('shows example use cases instead of testimonials', () => {
        renderMain();
        expect(screen.queryByText(/lorem ipsum/i)).not.toBeInTheDocument();
        const section = screen.getByRole('heading', { name: 'What you can automate' }).closest('section') as HTMLElement;
        expect(
            within(section)
                .getAllByRole('heading', { level: 3 })
                .map((heading) => heading.textContent)
        ).toEqual(['Trend alert', 'Price level alert', 'Volatility watch', 'Spot vs futures gap']);
    });

    it('answers Trading Assist questions in collapsible FAQ items', () => {
        renderMain();
        expect(screen.queryByText(/enigma/i)).not.toBeInTheDocument();
        const section = screen.getByRole('heading', { name: 'Frequently asked questions' }).closest('section') as HTMLElement;
        const items = section.querySelectorAll('details');
        expect(items).toHaveLength(6);
        expect(items[0]).toHaveAttribute('open');
        expect(items[1]).not.toHaveAttribute('open');
        expect(within(section).getByRole('heading', { level: 3, name: 'What is Trading Assist?' })).toBeInTheDocument();
    });

    it('links the final call to action to sign-up and sign-in', () => {
        renderMain();
        expect(screen.getByRole('link', { name: 'Create Your First Rule' })).toHaveAttribute('href', '/sign-up');
        expect(screen.getByRole('link', { name: 'Already have an account? Sign in' })).toHaveAttribute('href', '/sign-in');
    });
});
