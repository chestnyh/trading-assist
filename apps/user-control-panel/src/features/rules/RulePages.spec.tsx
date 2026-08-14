import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AddRulePage } from './AddRulePage';
import { UpdateRulePage } from './UpdateRulePage';
import { RuleDetailsPage } from './RuleDetailsPage';
import { AppProviders } from '../../app/providers/AppProviders';
import {
  customInstance,
  rulesControllerCreate,
  rulesControllerUpdate,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    customInstance: jest.fn(),
    rulesControllerCreate: jest.fn(),
    rulesControllerUpdate: jest.fn(),
  };
});

const mockCustomInstance = customInstance as jest.Mock;
const mockCreate = rulesControllerCreate as jest.Mock;
const mockUpdate = rulesControllerUpdate as jest.Mock;

const AUTH_USER = {
  id: 1,
  email: 'test@example.com',
  nickname: 'tester',
  name: 'Test User',
};

describe('Rules pages (CIT)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem('auth_token', 'token-123');
    window.localStorage.setItem('user_data', JSON.stringify(AUTH_USER));
    window.scrollTo = jest.fn();
  });

  describe('AddRulePage', () => {
    const setup = async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/rules/add']}>
          <AppProviders>
            <Routes>
              <Route path="/rules/add" element={<AddRulePage />} />
              <Route path="/rules" element={<div>Rules List Page</div>} />
            </Routes>
          </AppProviders>
        </MemoryRouter>
      );
      await screen.findByText('Adding Rule');
      return { user };
    };

    it('renders the rule form with name, description and rule body sections', async () => {
      await setup();

      expect(screen.getByText('Adding Rule')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Rule Name/ })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Rule Description/ })).toBeInTheDocument();
      expect(screen.getByText('Action Type')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    });

    it('saves a rule and navigates back to the rules list', async () => {
      mockCustomInstance.mockResolvedValue({ status: 200, data: { rules: [], total: 0 } });
      mockCreate.mockResolvedValue({ status: 201, data: { id: 1 } });
      const { user } = await setup();

      // Select a "log" action type first (ActionEditor is memoized, changing it
      // after typing would reset the name/description via a stale onChange).
      await user.selectOptions(
        screen.getByLabelText(/Action Type/i),
        'log'
      );

      fireEvent.change(screen.getByRole('textbox', { name: /Rule Name/ }), {
        target: { value: 'My Rule' },
      });
      fireEvent.change(screen.getByRole('textbox', { name: /Rule Description/ }), {
        target: { value: 'My description' },
      });

      const saveButton = screen.getByRole('button', { name: /Save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'My Rule',
            description: 'My description',
          })
        );
      });

      // Navigates back to /rules
      expect(await screen.findByText('Rules List Page')).toBeInTheDocument();
    });

    it('cancels and navigates back to the rules list', async () => {
      mockCustomInstance.mockResolvedValue({ status: 200, data: { rules: [], total: 0 } });
      const { user } = await setup();

      await user.click(screen.getByRole('button', { name: /Cancel/i }));

      expect(await screen.findByText('Rules List Page')).toBeInTheDocument();
    });
  });

  describe('UpdateRulePage', () => {
    const existingRule = {
      id: 5,
      name: 'Old Rule',
      description: 'Old description',
      ruleBody: { type: 'log', arguments: { message: 'old', level: 'info' } },
    };

    const setup = async () => {
      mockCustomInstance.mockResolvedValue({ status: 200, data: existingRule });
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/rules/5/update']}>
          <AppProviders>
            <Routes>
              <Route path="/rules/:id/update" element={<UpdateRulePage />} />
              <Route path="/rules" element={<div>Rules List Page</div>} />
            </Routes>
          </AppProviders>
        </MemoryRouter>
      );
      await screen.findByText('Update Rule');
      return { user };
    };

    it('renders the update form prefilled with existing data', async () => {
      await setup();

      expect(screen.getByText('Update Rule')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Rule Name/ })).toHaveValue('Old Rule');
      expect(screen.getByRole('textbox', { name: /Rule Description/ })).toHaveValue('Old description');
    });

    it('updates the rule and navigates back to the rules list', async () => {
      mockUpdate.mockResolvedValue({ status: 200, data: {} });
      const { user } = await setup();

      const nameInput = screen.getByRole('textbox', { name: /Rule Name/ });
      fireEvent.change(nameInput, {
        target: { value: 'New Rule Name' },
      });
      expect(nameInput).toHaveValue('New Rule Name');

      const updateButton = screen.getByRole('button', { name: /Update/i });
      expect(updateButton).not.toBeDisabled();
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          5,
          expect.objectContaining({
            name: 'New Rule Name',
            description: 'Old description',
          })
        );
      });

      expect(await screen.findByText('Rules List Page')).toBeInTheDocument();
    });

    it('shows NotFound when the rule does not exist', async () => {
      mockCustomInstance.mockResolvedValue({ status: 404, data: null });
      render(
        <MemoryRouter initialEntries={['/rules/999/update']}>
          <AppProviders>
            <Routes>
              <Route path="/rules/:id/update" element={<UpdateRulePage />} />
            </Routes>
          </AppProviders>
        </MemoryRouter>
      );

      expect(await screen.findByText('404')).toBeInTheDocument();
    });
  });

  describe('RuleDetailsPage', () => {
    const existingRule = {
      id: 5,
      name: 'Detail Rule',
      description: 'Detail description',
      ruleBody: { type: 'log', arguments: { message: 'hi', level: 'info' } },
    };

    const setup = async () => {
      mockCustomInstance.mockResolvedValue({ status: 200, data: existingRule });
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/rules/5']}>
          <AppProviders>
            <Routes>
              <Route path="/rules/:id" element={<RuleDetailsPage />} />
              <Route path="/rules" element={<div>Rules List Page</div>} />
            </Routes>
          </AppProviders>
        </MemoryRouter>
      );
      await screen.findByText('Detail Rule');
      return { user };
    };

    it('renders rule details with name, description and logs panel', async () => {
      await setup();

      expect(screen.getByText('Detail Rule')).toBeInTheDocument();
      expect(screen.getByText('Detail description')).toBeInTheDocument();
      expect(screen.getByText('Rule Name:')).toBeInTheDocument();
      expect(screen.getByText('Execution Logs:')).toBeInTheDocument();
      expect(screen.getByText('No logs yet. Waiting for rule execution...')).toBeInTheDocument();
    });

    it('navigates back to the rules list', async () => {
      const { user } = await setup();

      await user.click(screen.getByRole('button', { name: /Back/i }));

      expect(await screen.findByText('Rules List Page')).toBeInTheDocument();
    });

    it('shows NotFound when the rule does not exist', async () => {
      mockCustomInstance.mockResolvedValue({ status: 404, data: null });
      render(
        <MemoryRouter initialEntries={['/rules/999']}>
          <AppProviders>
            <Routes>
              <Route path="/rules/:id" element={<RuleDetailsPage />} />
            </Routes>
          </AppProviders>
        </MemoryRouter>
      );

      expect(await screen.findByText('404')).toBeInTheDocument();
    });
  });
});
