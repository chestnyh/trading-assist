import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';
import RuleSetting from '../../features/settings/components/RuleSetting';
import { AuthProvider } from '../contexts/AuthContext';

const renderWithAuth = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);

describe('Pagination', () => {
  const onChange = jest.fn();
  beforeEach(() => onChange.mockClear());

  it('renders previous/next controls on middle pages', async () => {
    const user = userEvent.setup();
    render(<Pagination current={2} total={80} pageSize={20} onChange={onChange} />);

    // Prev/next buttons are icon-only; find by title-less svg within the buttons
    const buttons = screen.getAllByRole('button');
    // First button = prev (chevron-left), last = next (chevron-right)
    await user.click(buttons[0]);
    expect(onChange).toHaveBeenCalledWith(1);

    await user.click(buttons[buttons.length - 1]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not render the next button on the last page', () => {
    render(<Pagination current={4} total={80} pageSize={20} onChange={onChange} />);
    // 4 pages: current=4 → no next button; prev exists
    const buttons = screen.getAllByRole('button');
    // Only page buttons + prev = 4 buttons (1,2,3,4 + prev)
    expect(buttons.length).toBe(5);
  });
});

describe('RuleSetting', () => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    onSave.mockClear();
    onCancel.mockClear();
    onEdit.mockClear();
    onDelete.mockClear();
  });

  it('renders view mode with details collapsed by default', () => {
    render(
      <RuleSetting
        name="My Setting"
        code="CODE_1"
        tags={['tag1']}
        details={[{ label: 'ApiKey', value: 'secret' }]}
      />
    );

    expect(screen.getByText('My Setting')).toBeInTheDocument();
    expect(screen.getByText('CODE_1')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    // Details are hidden until expanded
    expect(screen.queryByText('ApiKey:')).not.toBeInTheDocument();
  });

  it('expands to show details', async () => {
    render(
      <RuleSetting
        name="My Setting"
        code="CODE_1"
        details={[{ label: 'ApiKey', value: 'secret' }]}
        initiallyExpanded
      />
    );

    expect(screen.getByText('ApiKey:')).toBeInTheDocument();
    expect(screen.getByText('secret')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Collapse rule setting/i })).toBeInTheDocument();
  });

  it('switches to edit mode and back', async () => {
    const user = userEvent.setup();
    renderWithAuth(
      <RuleSetting
        name="My Setting"
        code="CODE_1"
        detailsSchema={[{ key: 'apiKey', label: 'ApiKey', required: true }]}
      />
    );

    await user.click(screen.getByRole('button', { name: /Edit rule setting/i }));
    expect(screen.getByText('Setting Name *')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.getByText('My Setting')).toBeInTheDocument();
  });

  it('uses controlled mode when provided', () => {
    renderWithAuth(
      <RuleSetting
        name="My Setting"
        code="CODE_1"
        mode="edit"
        detailsSchema={[{ key: 'apiKey', label: 'ApiKey' }]}
      />
    );

    expect(screen.getByText('Setting Name *')).toBeInTheDocument();
  });

  it('calls onEdit/onDelete handlers in view mode', async () => {
    const user = userEvent.setup();
    render(
      <RuleSetting
        name="My Setting"
        code="CODE_1"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /Edit rule setting/i }));
    expect(onEdit).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Delete rule setting/i }));
    expect(onDelete).toHaveBeenCalled();
  });
});
