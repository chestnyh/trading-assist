import { render } from '@testing-library/react';
import { ManNextToTheSafe } from './ManNextToTheSafe';

describe('restorePassword static components', () => {
  it('renders ManNextToTheSafe', () => {
    const { container } = render(<ManNextToTheSafe />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
