import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useServiceRuleSettings,
} from './useServiceRuleSettings';
import {
  rulesSettingsControllerCreateSetting,
  rulesSettingsControllerUpdateSetting,
  rulesSettingsControllerFindAllSettings,
  ServiceCode,
} from '@trading-bot/api-client';
import { useAuth } from '../../../app/contexts/AuthContext';

jest.mock('../../../app/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    rulesSettingsControllerCreateSetting: jest.fn(),
    rulesSettingsControllerUpdateSetting: jest.fn(),
    rulesSettingsControllerFindAllSettings: jest.fn(),
    rulesSettingsControllerRemoveSetting: jest.fn(),
  };
});

const mockUseAuth = useAuth as jest.Mock;
const mockCreate = rulesSettingsControllerCreateSetting as jest.Mock;
const mockUpdate = rulesSettingsControllerUpdateSetting as jest.Mock;
const mockFindAll = rulesSettingsControllerFindAllSettings as jest.Mock;

const fieldsSchema = [{ key: 'apiKey', label: 'API Key', required: true }];

const serverRule = {
  id: 1,
  name: 'My Bot',
  code: 'BOT_01',
  description: 'Existing description',
  configuration: { apiKey: 'secret' },
  authorId: 7,
};

describe('useServiceRuleSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ token: 'test-token' });
  });

  it('maps rule.description into SettingItem on fetch', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [serverRule],
    });

    const { result } = renderHook(() =>
      useServiceRuleSettings(ServiceCode.BINANCE, fieldsSchema)
    );

    act(() => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.settings).toHaveLength(1);
    });

    expect(result.current.settings[0].description).toBe('Existing description');
  });

  it('includes description in the create DTO for a new setting', async () => {
    mockCreate.mockResolvedValue({
      status: 201,
      data: { ...serverRule, description: 'New desc' },
    });

    const { result } = renderHook(() =>
      useServiceRuleSettings(ServiceCode.BINANCE, fieldsSchema)
    );

    act(() => {
      result.current.addNewSetting();
    });

    const newItem = result.current.settings[0];

    await act(async () => {
      await result.current.saveSetting(newItem, 0, {
        name: 'My Bot',
        code: 'BOT_01',
        tags: [],
        description: 'New desc',
        details: [],
      });
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My Bot',
        code: 'BOT_01',
        description: 'New desc',
      })
    );
  });

  it('sends an empty string description when clearing on update', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [serverRule],
    });
    mockUpdate.mockResolvedValue({
      status: 200,
      data: { ...serverRule, description: '' },
    });

    const { result } = renderHook(() =>
      useServiceRuleSettings(ServiceCode.BINANCE, fieldsSchema)
    );

    act(() => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.settings).toHaveLength(1);
    });

    const existing = result.current.settings[0];

    await act(async () => {
      await result.current.saveSetting(existing, 0, {
        name: 'My Bot',
        code: 'BOT_01',
        tags: [],
        description: '',
        details: [],
      });
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        description: '',
      })
    );
  });
});
