import { render, screen } from '@testing-library/react';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders the title and children', () => {
    render(<AuthLayout title="Sign In"><div>Form body</div></AuthLayout>);

    expect(
      screen.getByRole('heading', { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Form body')).toBeInTheDocument();
  });

  it('renders the illustration when provided', () => {
    const Illustration = () => <div>My Illustration</div>;
    render(
      <AuthLayout title="Sign Up" Illustration={Illustration}>
        <div>Form body</div>
      </AuthLayout>
    );

    expect(screen.getByText('My Illustration')).toBeInTheDocument();
  });

  it('renders the progress bar when currentStep is provided', () => {
    const { container } = render(
      <AuthLayout title="Sign Up" currentStep={2} totalSteps={4}>
        <div>Form body</div>
      </AuthLayout>
    );

    // FormProgressBar renders a gradient bar div
    const bar = container.querySelector('.rounded-md');
    expect(bar).not.toBeNull();
    expect((bar as HTMLElement).className).toContain('overflow-hidden');
  });

  it('renders actions when provided', () => {
    render(
      <AuthLayout title="Sign In" actions={<button type="button">Back</button>}>
        <div>Form body</div>
      </AuthLayout>
    );

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });
});
