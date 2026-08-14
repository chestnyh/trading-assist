import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TelegramSettingsGroup from './TelegramSettingsGroup';
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
    rulesSettingsControllerGetTelegramChatId: jest.fn(),
  };
});

const mockFindAll = rulesSettingsControllerFindAllSettings as jest.Mock;
const mockRemove = rulesSettingsControllerRemoveSetting as jest.Mock;

describe('TelegramSettingsGroup', () => {
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
        <TelegramSettingsGroup />
      </AuthProvider>
    );
    return { user };
  };

  it('renders the group header and expands to load settings', async () => {
    mockFindAll.mockResolvedValue({ status: 200, data: [] });
    const { user } = await setup();

    expect(screen.getByText('Telegram')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Expand service group/i }));

    await waitFor(() => {
      expect(mockFindAll).toHaveBeenCalledWith(
        expect.objectContaining({ serviceCode: 'TELEGRAM' })
      );
    });

    expect(await screen.findByRole('button', { name: /Add settings rules/i })).toBeInTheDocument();
  });

  it('renders an existing Telegram setting and deletes it', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'My Bot',
          code: 'TG_1',
          tags: [],
          configuration: { botToken: '123:ABC', chatId: 'chat-1' },
        },
      ],
    });
    mockRemove.mockResolvedValue({ status: 200, data: {} });
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /Expand service group/i }));
    expect(await screen.findByText('My Bot')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Delete rule setting/i }));
    await user.click(screen.getByRole('button', { name: /^Delete$/i }));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(1);
    });
  });

  it('falls back to a logo placeholder when the Telegram logo fails to load', async () => {
    const { user } = await setup();

    const logo = screen.getByAltText('Telegram logo');
    fireEvent.error(logo);

    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('shows loading while fetching settings', async () => {
    mockFindAll.mockImplementation(() => new Promise(() => undefined));
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /Expand service group/i }));

    expect(await screen.findByText('Loading settings…')).toBeInTheDocument();
  });

  it('shows an error when the settings fetch fails', async () => {
    mockFindAll.mockRejectedValue(new Error('Telegram fetch exploded'));
    const { user } = await setup();

    await user.click(screen.getByRole('button', { name: /Expand service group/i }));

    expect(await screen.findByText('Telegram fetch exploded')).toBeInTheDocument();
  });

  it('shows a "Load more" button when there are more pages and loads the next page', async () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Bot ${i}`,
      code: `TG_${i}`,
      tags: [],
      configuration: { botToken: '123:ABC', chatId: 'chat-1' },
    }));
    mockFindAll
      .mockResolvedValueOnce({ status: 200, data: many })
      .mockResolvedValueOnce({ status: 200, data: [{ id: 21, name: 'Extra Bot', code: 'TG_21', tags: [], configuration: {} }] });

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
});
