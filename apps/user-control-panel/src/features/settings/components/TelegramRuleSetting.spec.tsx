import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TelegramRuleSetting from './TelegramRuleSetting';
import { AuthProvider } from '../../../app/contexts/AuthContext';
import {
  rulesSettingsControllerGetTelegramChatId,
  rulesSettingsControllerUpdateSetting,
} from '@trading-bot/api-client';
import { SettingItem } from './useServiceRuleSettings';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    rulesSettingsControllerGetTelegramChatId: jest.fn(),
    rulesSettingsControllerUpdateSetting: jest.fn(),
  };
});

const mockGetChatId = rulesSettingsControllerGetTelegramChatId as jest.Mock;
const mockUpdate = rulesSettingsControllerUpdateSetting as jest.Mock;

const FIELDS_SCHEMA = [
  { key: 'botToken', label: 'BotToken', required: true, minLength: 45, maxLength: 50 },
  { key: 'chatId', label: 'ChatId', required: false },
];

const baseSetting: SettingItem = {
  clientId: 'rs-1',
  id: 1,
  name: 'My Bot',
  code: 'TELEGRAM_1',
  tags: ['main'],
  details: [{ label: 'BotToken', value: '123456:ABC' }],
  isNew: false,
  isEditing: false,
};

describe('TelegramRuleSetting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetChatId.mockResolvedValue({ status: 200, data: { chatId: 'chat-42' } });
    mockUpdate.mockResolvedValue({ status: 200, data: {} });
  });

  const setup = (overrides: Partial<typeof baseSetting> = {}) => {
    const setLoading = jest.fn();
    const setError = jest.fn();
    const onSave = jest.fn();
    const onEdit = jest.fn();
    const onCancel = jest.fn();
    const onDelete = jest.fn();
    const onDetailsChange = jest.fn();
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TelegramRuleSetting
          setting={{ ...baseSetting, ...overrides }}
          fieldsSchema={FIELDS_SCHEMA}
          setLoading={setLoading}
          setError={setError}
          onSave={onSave}
          onEdit={onEdit}
          onCancel={onCancel}
          onDelete={onDelete}
          onDetailsChange={onDetailsChange}
        />
      </AuthProvider>
    );

    return { user, setLoading, setError, onSave, onEdit, onCancel, onDelete, onDetailsChange };
  };

  it('renders the view mode with setting name and code', () => {
    setup();

    expect(screen.getByText('My Bot')).toBeInTheDocument();
    expect(screen.getByText('TELEGRAM_1')).toBeInTheDocument();
  });

  it('shows the "Receive Chat Id" flow when no chatId is configured', async () => {
    const { user } = setup();

    // No chatId in details → "receive" stage
    expect(await screen.findByRole('button', { name: /Receive Chat Id/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Receive Chat Id/i }));

    expect(mockGetChatId).toHaveBeenCalledWith(1);

    // Confirm stage appears once the chat id is received
    expect(
      await screen.findByRole('button', { name: /^Send$/i })
    ).toBeInTheDocument();
  });

  it('saves the chat id via the confirm stage', async () => {
    const { user, onDetailsChange } = setup();

    await user.click(await screen.findByRole('button', { name: /Receive Chat Id/i }));
    await screen.findByRole('button', { name: /^Send$/i });

    await user.click(screen.getByRole('button', { name: /^Send$/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          configuration: expect.objectContaining({ chatId: 'chat-42' }),
        })
      );
    });

    expect(onDetailsChange).toHaveBeenCalledWith(
      'rs-1',
      expect.arrayContaining([expect.objectContaining({ label: 'ChatId', value: 'chat-42' })])
    );

    expect(
      await screen.findByText(/Your settings completely saved/i)
    ).toBeInTheDocument();
  });

  it('shows a flow error when receiving the chat id fails', async () => {
    mockGetChatId.mockRejectedValue(new Error('Chat id fetch failed'));
    const { user } = setup();

    await user.click(await screen.findByRole('button', { name: /Receive Chat Id/i }));

    expect(await screen.findByText('Chat id fetch failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Receive Chat Id/i })).toBeInTheDocument();
  });

  it('shows "success" stage when a chatId is already configured', async () => {
    const { user } = setup({
      details: [
        { label: 'BotToken', value: '123456:ABC' },
        { label: 'ChatId', value: 'existing-chat' },
      ],
    });

    // The success message lives in the expandable extra slot
    await user.click(screen.getByRole('button', { name: /Expand rule setting/i }));

    expect(
      await screen.findByText(/Your settings completely saved/i)
    ).toBeInTheDocument();
  });

  it('renders edit mode when isNew', () => {
    setup({ isNew: true });

    expect(screen.getByText('Setting Name *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Insert Name here…')).toBeInTheDocument();
  });
});
