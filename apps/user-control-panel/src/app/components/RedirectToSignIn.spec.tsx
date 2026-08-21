import { render } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { RedirectToSignIn } from './RedirectToSignIn';
 
jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(() => null),
}));
 
const mockedNavigate = Navigate as jest.Mock;
 
describe('RedirectToSignIn', () => {
  it('renders a Navigate to /sign-in with replace', () => {
    render(<RedirectToSignIn />);
 
    expect(mockedNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/sign-in', replace: true }),
      undefined,
    );
  });
});
 