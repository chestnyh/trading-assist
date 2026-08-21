import { render, screen } from '@testing-library/react';
import { Main } from './Main';

describe('Main', () => {
    it('renders without crashing', () => {
        render(<Main />);
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});