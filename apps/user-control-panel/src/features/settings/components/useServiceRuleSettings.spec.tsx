import { renderHook, act, waitFor } from '@testing-library/react';
import { useServiceRuleSettings } from './useServiceRuleSettings';
import {
  rulesSettingsControllerFindAllSettings,
  rulesSettingsControllerCreateSetting,
  rulesSettingsControllerUpdateSetting,
  rulesSettingsControllerRemoveSetting,
} from '@trading-bot/api-client';
import { AuthProvider } from '../../../app/contexts/AuthContext';
import { ReactNode } from 'react';

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
const mockCreate = rulesSettingsControllerCreateSetting as jest.Mock;
const mockUpdate = rulesSettingsControllerUpdateSetting as jest.Mock;
const mockRemove = rulesSettingsControllerRemoveSetting as jest.Mock;

const FIELDS_SCHEMA = [
  { key: 'apiKey', label: 'ApiKey', required: true, exactLength: 32 },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useServiceRuleSettings', () => {
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

  it('fetches settings on expand and maps them', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Key A',
          code: 'A',
          tags: ['t1'],
          configuration: { apiKey: 'k' },
        },
      ],
    });
    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    await act(async () => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.settings).toHaveLength(1);
    });

    expect(result.current.settings[0]).toMatchObject({
      id: 1,
      name: 'Key A',
      code: 'A',
      tags: ['t1'],
      isNew: false,
      isEditing: false,
    });
    expect(mockFindAll).toHaveBeenCalledWith(
      expect.objectContaining({ serviceCode: 'BINANCE', page: 1 })
    );
  });

  it('sets hasMore when the page is full and the next page has data', async () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `S${i}`,
      code: `C${i}`,
      tags: [],
      configuration: {},
    }));
    mockFindAll
      .mockResolvedValueOnce({ status: 200, data: many })
      .mockResolvedValueOnce({ status: 200, data: [{ id: 21, name: 'S20', code: 'C', tags: [], configuration: {} }] });

    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    await act(async () => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });

  it('sets hasMore false when the page is not full', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [{ id: 1, name: 'A', code: 'A', tags: [], configuration: {} }],
    });

    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    await act(async () => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  it('surfaces an error when fetching fails', async () => {
    mockFindAll.mockRejectedValue(new Error('Failed to load'));

    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    await act(async () => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load');
    });
  });

  it('saves a new setting and updates the list', async () => {
    mockCreate.mockResolvedValue({ status: 201, data: { id: 5 } });

    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    act(() => {
      result.current.addNewSetting();
    });
    expect(result.current.settings[0].isNew).toBe(true);

    await act(async () => {
      await result.current.saveSetting(
        result.current.settings[0],
        0,
        { name: 'New', code: 'NC', tags: [], details: [{ label: 'ApiKey', value: 'key' }] }
      );
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New',
        code: 'NC',
        serviceCode: 'BINANCE',
        configuration: { apiKey: 'key' },
      })
    );
    expect(result.current.settings[0]).toMatchObject({
      name: 'New',
      code: 'NC',
      isNew: false,
      isEditing: false,
      id: 5,
    });
  });

  it('saves an existing setting via update', async () => {
    mockUpdate.mockResolvedValue({ status: 200, data: {} });

    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    act(() => {
      result.current.addNewSetting();
    });
    // Convert to existing: set id and isNew false
    const s = result.current.settings[0];
    await act(async () => {
      await result.current.saveSetting(
        { ...s, id: 3, isNew: false },
        0,
        { name: 'Upd', code: 'UC', tags: [], details: [{ label: 'ApiKey', value: 'k2' }] }
      );
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      3,
      expect.objectContaining({
        name: 'Upd',
        code: 'UC',
        configuration: { apiKey: 'k2' },
      })
    );
    expect(result.current.settings[0]).toMatchObject({ name: 'Upd', code: 'UC' });
  });

  it('sets an error when updating an existing setting without an id', async () => {
    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    act(() => {
      result.current.addNewSetting();
    });

    await act(async () => {
      await result.current.saveSetting(
        { ...result.current.settings[0], isNew: false },
        0,
        { name: 'X', code: 'Y', tags: [], details: [] }
      );
    });

    expect(result.current.error).toBe('Setting ID is missing');
  });

  it('cancels a new setting (removes it) and an existing one (exits edit mode)', async () => {
    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    act(() => {
      result.current.addNewSetting();
    });
    expect(result.current.settings).toHaveLength(1);

    act(() => {
      result.current.cancelSetting(result.current.settings[0], 0);
    });
    expect(result.current.settings).toHaveLength(0);

    act(() => {
      result.current.addNewSetting();
      result.current.editSetting(0);
    });
    expect(result.current.settings[0].isEditing).toBe(true);

    act(() => {
      result.current.cancelSetting(
        { ...result.current.settings[0], id: 9, isNew: false },
        0
      );
    });
    expect(result.current.settings[0].isEditing).toBe(false);
  });

  it('deletes a setting without an id by removing it locally', async () => {
    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    act(() => {
      result.current.addNewSetting();
    });

    await act(async () => {
      await result.current.deleteSetting(undefined, 0);
    });

    expect(result.current.settings).toHaveLength(0);
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('deletes a setting with an id via the API', async () => {
    mockRemove.mockResolvedValue({ status: 200, data: {} });
    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    act(() => {
      result.current.addNewSetting();
    });

    await act(async () => {
      await result.current.deleteSetting(7, 0);
    });

    expect(mockRemove).toHaveBeenCalledWith(7);
    expect(result.current.settings).toHaveLength(0);
  });

  it('fetches additional pages via fetchSettingsPage', async () => {
    mockFindAll.mockResolvedValue({
      status: 200,
      data: [
        { id: 1, name: 'A', code: 'A', tags: [], configuration: {} },
        { id: 2, name: 'B', code: 'B', tags: [], configuration: {} },
      ],
    });
    const { result } = renderHook(
      () => useServiceRuleSettings('BINANCE', FIELDS_SCHEMA),
      { wrapper }
    );

    await act(async () => {
      await result.current.fetchSettingsPage(2);
    });

    expect(result.current.settings).toHaveLength(2);
    expect(result.current.page).toBe(2);
    expect(mockFindAll).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });
});
