import { render } from '@testing-library/react';
import { Facebook } from './icons/Facebook';
import { Google } from './icons/Google';
import { ManNextToTheSafe } from './svg/ManNextToTheSafe';

describe('signIn static components', () => {
  it.each([
    ['Facebook', Facebook],
    ['Google', Google],
    ['ManNextToTheSafe', ManNextToTheSafe],
  ] as const)('renders %s', (_name, Component) => {
    const { container } = render(<Component />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
