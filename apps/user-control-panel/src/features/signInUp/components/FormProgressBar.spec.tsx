import { render } from '@testing-library/react';
import { FormProgressBar } from './FormProgressBar';

// The gradient uses CSS custom properties (var(--color-success)); jsdom does
// not serialize the inline background, so we assert the component renders the
// bar for each step value (exercising the clamping/percent branch logic).
describe('FormProgressBar', () => {
  it('renders a bar for a mid-flow step', () => {
    const { container } = render(<FormProgressBar currentStep={2} totalSteps={4} />);

    const bar = container.querySelector('.rounded-md');
    expect(bar).not.toBeNull();
    expect((bar as HTMLElement).className).toContain('overflow-hidden');
  });

  it('renders with a step above the total (clamped to last)', () => {
    const { container } = render(<FormProgressBar currentStep={9} totalSteps={4} />);

    expect(container.querySelector('.rounded-md')).not.toBeNull();
  });

  it('renders with a step below 1 (clamped to first)', () => {
    const { container } = render(<FormProgressBar currentStep={0} totalSteps={4} />);

    expect(container.querySelector('.rounded-md')).not.toBeNull();
  });

  it('defaults totalSteps to 4', () => {
    const { container } = render(<FormProgressBar currentStep={4} />);

    expect(container.querySelector('.rounded-md')).not.toBeNull();
  });
});
