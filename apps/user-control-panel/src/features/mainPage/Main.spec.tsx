import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Main } from './Main';

describe('Main (mainPage)', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  };

  it('renders the hero section with the main headline and subcopy', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: /Unlock Your Coding Potential/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Learn coding and design with Enigma-AI/i)
    ).toBeInTheDocument();
    expect(screen.getByAltText('Financial Chart')).toBeInTheDocument();
  });

  it('renders hero call-to-action buttons', () => {
    setup();

    // "Get Started" appears in both the hero and the bottom CTA section
    expect(
      screen.getAllByRole('button', { name: /Get Started/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: /Start a Free Trial/i })
    ).toBeInTheDocument();
  });

  it('renders the "How it works" section with three steps', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: /How it works/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Step 1/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Step 2/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Step 3/i })).toBeInTheDocument();
  });

  it('renders the "Check on the go" section', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: /Check on the go/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Scan to get access to our chatbot/i)).toBeInTheDocument();
    expect(screen.getByText(/IOS & Android/i)).toBeInTheDocument();
  });

  it('renders the testimonials section', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: /Testimonials Section/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Hadid Khan')).toBeInTheDocument();
    expect(screen.getByText('Wade Warren')).toBeInTheDocument();
    expect(screen.getByText('Jenny Wilson')).toBeInTheDocument();
    expect(screen.getByText('Max Wieder')).toBeInTheDocument();
  });

  it('renders the news/charts section', () => {
    setup();

    // This copy appears in multiple cards on the page
    expect(
      screen.getAllByText(/Ready to dive in\? Here's how you can start contributing/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Access a wealth of resources to support your development journey/i).length
    ).toBeGreaterThan(0);
  });

  it('renders the FAQ section with common questions', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: /Frequently Asked Questions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /What is Enigma Code-ai\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /How do I get started with Enigma Code-ai\?/i })
    ).toBeInTheDocument();
  });

  it('renders the final call-to-action section', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: /Many users trust us/i })
    ).toBeInTheDocument();
    expect(screen.getByText('join us')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Learn more/i })
    ).toBeInTheDocument();
  });
});
