import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Settings from './Settings';
import { AppProviders } from '../../app/providers/AppProviders';
import {
  rulesSettingsControllerFindAllSettings,
  rulesSettingsControllerCreateSetting,
  rulesSettingsControllerRemoveSetting,
  rulesSettingsTagsControllerFindAllTags,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    rulesSettingsControllerFindAllSettings: jest.fn(),
    rulesSettingsControllerCreateSetting: jest.fn(),
    rulesSettingsControllerRemoveSetting: jest.fn(),
    rulesSettingsControllerUpdateSetting: jest.fn(),
    rulesSettingsControllerGetTelegramChatId: jest.fn(),
    rulesSettingsTagsControllerFindAllTags: jest.fn(),
    rulesSettingsTagsControllerCreateTag: jest.fn(),
  };
});

const mockFindAll = rulesSettingsControllerFindAllSettings as jest.Mock;
const mockCreate = rulesSettingsControllerCreateSetting as jest.Mock;
const mockRemove = rulesSettingsControllerRemoveSetting as jest.Mock;
const mockFindTags = rulesSettingsTagsControllerFindAllTags as jest.Mock;

const AUTH_USER = {
  id: 1,
  email: 'test@example.com',
  nickname: 'tester',
  name: 'Test User',
};

describe('Settings (CIT)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem('auth_token', 'token-123');
    window.localStorage.setItem('user_data', JSON.stringify(AUTH_USER));
    // Empty settings for all service groups
    mockFindAll.mockResolvedValue({ status: 200, data: [] });
    mockFindTags.mockResolvedValue({ status: 200, data: [] });
  });

  const setup = async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <AppProviders>
          <Settings />
        </AppProviders>
      </MemoryRouter>
    );
    await screen.findByText('Rules Settings');
    return { user };
  };

  it('renders the settings page with all service groups', async () => {
    await setup();

    expect(screen.getByRole('heading', { name: /Rules Settings/i })).toBeInTheDocument();
    expect(screen.getByText('Telegram')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Discord Webhooks')).toBeInTheDocument();
    expect(screen.getByText('Slack Webhooks')).toBeInTheDocument();
    expect(screen.getByText('SMS (via Twilio)')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications (One Signal)')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Business API')).toBeInTheDocument();
    expect(screen.getByText('Binance')).toBeInTheDocument();
    expect(screen.getByText('Bybit')).toBeInTheDocument();
    expect(screen.getByText('Kraken')).toBeInTheDocument();
  });

  it('expands a service group and loads its settings', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'My Binance Key',
          code: 'BINANCE_1',
          tags: ['main'],
          configuration: { apiKey: 'key-123', apiSecret: 'secret-123', baseUrl: 'https://api.binance.com' },
        },
      ],
    });
    const { user } = await setup();

    const binanceGroup = screen.getByText('Binance').closest('div')!.parentElement!;
    await user.click(within(binanceGroup).getByRole('button', { name: /Expand service group/i }));

    expect(await screen.findByText('My Binance Key')).toBeInTheDocument();
    expect(screen.getByText('BINANCE_1')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
    // Fetched with the BINANCE service code
    expect(mockFindAll).toHaveBeenCalledWith(
      expect.objectContaining({ serviceCode: 'BINANCE' })
    );
  });

  it('adds a new setting via the "Add settings rules" button', async () => {
    mockCreate.mockResolvedValue({ status: 201, data: { id: 2 } });
    const { user } = await setup();

    const binanceGroup = screen.getByText('Binance').closest('div')!.parentElement!;
    await user.click(within(binanceGroup).getByRole('button', { name: /Expand service group/i }));

    await user.click(await screen.findByRole('button', { name: /Add settings rules/i }));

    // Edit form appears
    expect(screen.getByText('Setting Name *')).toBeInTheDocument();
    expect(screen.getByText('Setting Code *')).toBeInTheDocument();
  });

  it('deletes an existing setting via the confirmation modal', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'My Binance Key',
          code: 'BINANCE_1',
          tags: [],
          configuration: { apiKey: 'key-123', apiSecret: 'secret-123', baseUrl: 'https://api.binance.com' },
        },
      ],
    });
    mockRemove.mockResolvedValue({ status: 200, data: {} });
    const { user } = await setup();

    const binanceGroup = screen.getByText('Binance').closest('div')!.parentElement!;
    await user.click(within(binanceGroup).getByRole('button', { name: /Expand service group/i }));
    await screen.findByText('My Binance Key');

    await user.click(screen.getByRole('button', { name: /Delete rule setting/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Delete$/i }));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(1);
    });
    expect(screen.queryByText('My Binance Key')).not.toBeInTheDocument();
  });
});
