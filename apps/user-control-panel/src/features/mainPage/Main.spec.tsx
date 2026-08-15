import { render, screen } from '@testing-library/react';
import { Main } from './Main';

describe('Main', () => {
    it('renders the hero section with the main heading', () => {
        render(<Main />);
        expect(
            screen.getByRole('heading', { name: /unlock your coding potential/i })
        ).toBeInTheDocument();
    });

    it('renders hero CTA buttons', () => {
        render(<Main />);
        expect(screen.getAllByRole('button', { name: /get started/i })).toHaveLength(2);
        expect(screen.getByRole('button', { name: /start a free trial/i })).toBeInTheDocument();
    });

    it('renders "How it works" section with three steps', () => {
        render(<Main />);
        expect(screen.getByRole('heading', { name: /how it works/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^step 1$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^step 2$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^step 3$/i })).toBeInTheDocument();
    });

    it('renders "Check on the go" section with the chatbot mockup', () => {
        render(<Main />);
        expect(
            screen.getByRole('heading', { name: /check on the go anytime anywhere/i })
        ).toBeInTheDocument();
        expect(screen.getByText('Trading Assist')).toBeInTheDocument();
    });

    it('renders the testimonials section with four testimonials', () => {
        render(<Main />);
        expect(
            screen.getByRole('heading', { name: /testimonials section/i })
        ).toBeInTheDocument();
        expect(screen.getByText('Hadid Khan')).toBeInTheDocument();
        expect(screen.getByText('Wade Warren')).toBeInTheDocument();
        expect(screen.getByText('Jenny Wilson')).toBeInTheDocument();
        expect(screen.getByText('Max Wieder')).toBeInTheDocument();
    });

    it('renders the news section with three graph cards', () => {
        render(<Main />);
        expect(screen.getAllByText(/ready to dive in\?/i)).toHaveLength(2);
        expect(screen.getAllByText(/access a wealth of resources/i)).toHaveLength(4);
    });

    it('renders the FAQ section', () => {
        render(<Main />);
        expect(
            screen.getByRole('heading', { name: /frequently asked questions/i })
        ).toBeInTheDocument();
        expect(screen.getByText('What is Enigma Code-ai?')).toBeInTheDocument();
        expect(
            screen.getByText('How do I get started with Enigma Code-ai?')
        ).toBeInTheDocument();
    });

    it('renders the call to action section', () => {
        render(<Main />);
        expect(screen.getByRole('heading', { name: /many users trust us/i })).toBeInTheDocument();
        expect(screen.getByText('join us')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
    });
});
