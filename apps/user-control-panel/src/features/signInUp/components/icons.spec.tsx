import { render } from '@testing-library/react';
import { AlertTriangle } from './icons/AlertTriangle';
import { ArrowLeft } from './icons/ArrowLeft';
import { ArrowRight } from './icons/ArrowRight';
import { Eye } from './icons/Eye';
import { EyeOff } from './icons/EyeOff';
import { ManAtTheTable } from './svg/ManAtTheTable';
import { ManNearTheLamp } from './svg/ManNearTheLamp';
import { ManNearTheTarget } from './svg/ManNearTheTarget';

describe('signInUp static components', () => {
  it.each([
    ['AlertTriangle', AlertTriangle],
    ['ArrowLeft', ArrowLeft],
    ['ArrowRight', ArrowRight],
    ['Eye', Eye],
    ['EyeOff', EyeOff],
    ['ManAtTheTable', ManAtTheTable],
    ['ManNearTheLamp', ManNearTheLamp],
    ['ManNearTheTarget', ManNearTheTarget],
  ] as const)('renders %s', (_name, Component) => {
    const { container } = render(<Component />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('passes className to icon components', () => {
    const { container } = render(<AlertTriangle className="custom-size" />);
    expect(container.querySelector('svg')).toHaveAttribute('class', 'custom-size');
  });
});
