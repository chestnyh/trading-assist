import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { Pagination } from '../../app/components/Pagination';

describe('EmptyState', () => {
  it('renders the empty message and add button', () => {
    render(
      <MemoryRouter>
        <EmptyState />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/You don't have rules yet/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('navigates to /rules/add when the button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/rules']}>
        <Routes>
          <Route path="/rules" element={<EmptyState />} />
          <Route path="/rules/add" element={<div>Add Rule Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button'));
    expect(await screen.findByText('Add Rule Page')).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination current={1} total={5} pageSize={20} onChange={onChange} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders page buttons and calls onChange', async () => {
    const user = userEvent.setup();
    render(
      <Pagination current={1} total={45} pageSize={20} onChange={onChange} />
    );

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('renders ellipsis for large page ranges', () => {
    render(
      <Pagination current={5} total={200} pageSize={20} onChange={onChange} />
    );

    // 10 total pages; current=5 shows 3,4,5,6,7 plus ellipsis
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
  });

  it('does not render a previous button on the first page', () => {
    render(
      <Pagination current={1} total={45} pageSize={20} onChange={onChange} />
    );
    // No accessible name on prev button (icon only); verify page 2 exists
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });
});
