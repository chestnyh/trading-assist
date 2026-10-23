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
});
