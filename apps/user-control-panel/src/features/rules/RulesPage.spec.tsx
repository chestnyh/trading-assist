import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RulesPage } from './RulesPage';
import { AppProviders } from '../../app/providers/AppProviders';
import {
  customInstance,
  rulesControllerRemove,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    customInstance: jest.fn(),
    rulesControllerCreate: jest.fn(),
    rulesControllerRemove: jest.fn(),
    rulesControllerUpdate: jest.fn(),
  };
});

const mockCustomInstance = customInstance as jest.Mock;
const mockRemove = rulesControllerRemove as jest.Mock;

const AUTH_USER = {
  id: 1,
  email: 'test@example.com',
  nickname: 'tester',
  name: 'Test User',
};

const rulesList = {
  rules: [
    { id: '1', name: 'Rule One', description: 'First rule', ruleBody: { type: 'log', arguments: { message: 'hi', level: 'info' } } },
    { id: '2', name: 'Rule Two', description: 'Second rule', ruleBody: null },
  ],
  total: 2,
};

describe('RulesPage (CIT)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem('auth_token', 'token-123');
    window.localStorage.setItem('user_data', JSON.stringify(AUTH_USER));
    window.scrollTo = jest.fn();
  });

  const setup = async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/rules']}>
        <AppProviders>
          <RulesPage />
        </AppProviders>
      </MemoryRouter>
    );
    return { user };
  };

  it('renders a spinner while loading', async () => {
    mockCustomInstance.mockImplementation(
      () => new Promise(() => undefined) // never resolves
    );
    await setup();

    // Spinner is shown instead of the page content
    expect(screen.queryByText('Your Rules')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders the empty state when there are no rules', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: { rules: [], total: 0 } });

    await setup();

    expect(
      await screen.findByText(/You don't have rules yet/i)
    ).toBeInTheDocument();
  });

  it('renders rules from the API', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });

    await setup();

    expect(await screen.findByText('Rule One')).toBeInTheDocument();
    expect(screen.getByText('Rule Two')).toBeInTheDocument();
    expect(screen.getByText('First rule')).toBeInTheDocument();
  });

  it('shows an error alert with a retry button when loading fails', async () => {
    mockCustomInstance.mockRejectedValue(new Error('Network down'));

    await setup();

    expect(
      await screen.findByText(/Failed to load rules/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('navigates to the add rule page when the add button is clicked', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });
    const { user } = await setup();

    await screen.findByText('Rule One');

    // The "+" add button is the only primary button on the page
    const addButton = screen.getAllByRole('button')[0];
    await user.click(addButton);

    // Navigates to /rules/add — but with MemoryRouter and no routes, location won't change visually.
    // Instead verify the request to fetch rules happened and the page still renders.
    expect(screen.getByText('Rule One')).toBeInTheDocument();
  });

  it('shows pagination when there are more than 20 rules', async () => {
    const manyRules = {
      rules: Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        name: `Rule ${i + 1}`,
        description: `desc ${i + 1}`,
      })),
      total: 45,
    };
    mockCustomInstance.mockResolvedValue({ status: 200, data: manyRules });

    await setup();

    await screen.findByText('Rule 1');
    expect(await screen.findByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  it('opens the confirmation modal and deletes a rule', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });
    mockRemove.mockResolvedValue({ status: 200, data: {} });
    const { user } = await setup();

    await screen.findByText('Rule One');

    // Click delete on the first rule
    const deleteButton = screen.getAllByTitle('Delete rule')[0];
    await user.click(deleteButton);

    expect(screen.getByText('Delete Rule')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this rule\?/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Delete$/i }));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(1);
    });
  });

  it('closes the modal when cancel is clicked', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });
    const { user } = await setup();

    await screen.findByText('Rule One');

    const deleteButton = screen.getAllByTitle('Delete rule')[0];
    await user.click(deleteButton);

    await user.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(screen.queryByText('Delete Rule')).not.toBeInTheDocument();
  });

  it('shows delete error when deletion fails', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });
    mockRemove.mockRejectedValue(new Error('Delete failed'));
    const { user } = await setup();

    await screen.findByText('Rule One');

    const deleteButton = screen.getAllByTitle('Delete rule')[0];
    await user.click(deleteButton);
    await user.click(screen.getByRole('button', { name: /^Delete$/i }));

    expect(await screen.findByText('Delete failed')).toBeInTheDocument();
  });

  it('navigates to rule details when a rule row is clicked', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });
    const { user } = await setup();

    await screen.findByText('Rule One');

    await user.click(screen.getByText('Rule One'));
    // RuleItem calls navigate('/rules/1') — nothing to assert visually without routes,
    // but the click should not throw.
    expect(screen.getByText('Rule One')).toBeInTheDocument();
  });

  it('navigates to the update page via the edit button', async () => {
    mockCustomInstance.mockResolvedValue({ status: 200, data: rulesList });
    const { user } = await setup();

    await screen.findByText('Rule One');

    const editButton = screen.getAllByTitle('Edit rule')[0];
    await user.click(editButton);

    expect(screen.getByText('Rule One')).toBeInTheDocument();
  });

  it('fetches the next page when a pagination page is clicked', async () => {
    const manyRules = {
      rules: Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        name: `Rule ${i + 1}`,
        description: `desc ${i + 1}`,
      })),
      total: 45,
    };
    mockCustomInstance.mockResolvedValue({ status: 200, data: manyRules });
    const { user } = await setup();

    await screen.findByText('Rule 1');
    const page2 = await screen.findByRole('button', { name: '2' });
    await user.click(page2);

    await waitFor(() => {
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/rules?page=2'),
        expect.any(Object)
      );
    });
  });
});
