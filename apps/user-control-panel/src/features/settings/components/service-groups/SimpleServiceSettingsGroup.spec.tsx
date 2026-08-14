import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SimpleServiceSettingsGroup from './SimpleServiceSettingsGroup';
import { AuthProvider } from '../../../../app/contexts/AuthContext';
import {
  rulesSettingsControllerFindAllSettings,
  rulesSettingsControllerRemoveSetting,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    rulesSettingsControllerFindAllSettings: jest.fn(),
    rulesSettingsControllerCreateSetting: jest.fn(),
    rulesSettingsControllerUpdateSetting: jest.fn(),
    rulesSettingsControllerRemoveSetting: jest.fn(),
  };
});

const mockFindAll = rulesSettingsControllerFindAllSettings as jest.Mock;
const mockRemove = rulesSettingsControllerRemoveSetting as jest.Mock;

const FIELDS = [
  { key: 'apiKey', label: 'ApiKey', required: true, exactLength: 32, placeholder: 'Insert api key…' },
];

describe('SimpleServiceSettingsGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem('auth_token', 'token-123');
    window.localStorage.setItem(
      'user_data',
      JSON.stringify({ id: 1, email: 'a@b.c', nickname: 'n' })
    );
  });

  const setup = async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <SimpleServiceSettingsGroup
          serviceCode="BINANCE"
          name="Binance"
          logoUrl="/logos/binance.svg"
          fieldsSchema={FIELDS}
        />
      </AuthProvider>
    );
    return { user };
  };

  it('falls back to a logo placeholder when the image fails to load', async () => {
    await setup();

    const logo = screen.getByAltText('Binance logo');
    fireEvent.error(logo);

    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('shows loading and error states inside the expanded panel', async () => {
    mockFindAll.mockImplementation(() => new Promise(() => undefined));
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /Expand service group/i }));
    expect(await screen.findByText('Loading settings…')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    mockFindAll.mockRejectedValue(new Error('Fetch exploded'));
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /Expand service group/i }));

    expect(await screen.findByText('Fetch exploded')).toBeInTheDocument();
  });

  it('shows a "Load more" button when there are more pages and loads them', async () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `S${i}`,
      code: `C${i}`,
      tags: [],
      configuration: { apiKey: 'k' },
    }));
    mockFindAll
      .mockResolvedValueOnce({ status: 200, data: many })
      .mockResolvedValueOnce({ status: 200, data: [{ id: 21, name: 'Extra', code: 'X', tags: [], configuration: {} }] });

    const { user } = await setup();
    await user.click(screen.getByRole('button', { name: /Expand service group/i }));

    const loadMore = await screen.findByRole('button', { name: /Load more/i });
    await user.click(loadMore);

    await waitFor(() => {
      expect(mockFindAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });

  it('deletes a setting through the confirmation modal', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [
        { id: 1, name: 'Key A', code: 'A', tags: [], configuration: { apiKey: 'k' } },
      ],
    });
    mockRemove.mockResolvedValue({ status: 200, data: {} });

    const { user } = await setup();
    await user.click(screen.getByRole('button', { name: /Expand service group/i }));
    await screen.findByText('Key A');

    await user.click(screen.getByRole('button', { name: /Delete rule setting/i }));
    await user.click(screen.getByRole('button', { name: /^Delete$/i }));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(1);
    });
    expect(screen.queryByText('Key A')).not.toBeInTheDocument();
  });
});
