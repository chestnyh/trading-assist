import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { RulesProvider, useRules } from './RulesContext';
import {
  customInstance,
  rulesControllerCreate,
  rulesControllerUpdate,
  rulesControllerRemove,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    customInstance: jest.fn(),
    rulesControllerCreate: jest.fn(),
    rulesControllerUpdate: jest.fn(),
    rulesControllerRemove: jest.fn(),
  };
});

const mockCustomInstance = customInstance as jest.Mock;
const mockCreate = rulesControllerCreate as jest.Mock;
const mockUpdate = rulesControllerUpdate as jest.Mock;
const mockRemove = rulesControllerRemove as jest.Mock;

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <RulesProvider>{children}</RulesProvider>
  </AuthProvider>
);

describe('RulesContext', () => {
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

  it('fetches rules on mount and stores them', async () => {
    mockCustomInstance.mockResolvedValue({
      status: 200,
      data: { rules: [{ id: '1', name: 'R1', description: 'd' }], total: 1 },
    });
    const { result } = renderHook(() => useRules(), { wrapper });

    await waitFor(() => {
      expect(result.current.rules).toHaveLength(1);
    });
    expect(result.current.totalCount).toBe(1);
    expect(mockCustomInstance).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/rules?page=1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('does not fetch without a token', async () => {
    window.localStorage.removeItem('auth_token');
    const { result } = renderHook(() => useRules(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(mockCustomInstance).not.toHaveBeenCalled();
  });

  it('sets an error when fetching rules fails', async () => {
    mockCustomInstance.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useRules(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toMatch(/failed to load rules/i);
    });
    expect(result.current.rules).toEqual([]);
  });

  it('getRuleById returns the rule', async () => {
    mockCustomInstance.mockResolvedValue({
      status: 200,
      data: { id: 5, name: 'R5', description: 'd' },
    });
    const { result } = renderHook(() => useRules(), { wrapper });

    let rule: unknown;
    await act(async () => {
      rule = await result.current.getRuleById('5');
    });
    expect(rule).toMatchObject({ id: 5 });
  });

  it('getRuleById returns null for non-200 responses and errors', async () => {
    // First call (mount fetch) succeeds with an empty list; subsequent calls
    // target getRuleById.
    mockCustomInstance.mockResolvedValue({ status: 200, data: { rules: [], total: 0 } });
    const { result } = renderHook(() => useRules(), { wrapper });

    let rule: unknown;
    mockCustomInstance.mockResolvedValueOnce({ status: 404 });
    await act(async () => {
      rule = await result.current.getRuleById('5');
    });
    expect(rule).toBeNull();

    mockCustomInstance.mockRejectedValueOnce(new Error('x'));
    await act(async () => {
      rule = await result.current.getRuleById('5');
    });
    expect(rule).toBeNull();
  });

  it('addRule returns false without a token', async () => {
    window.localStorage.removeItem('auth_token');
    const { result } = renderHook(() => useRules(), { wrapper });

    let ok!: boolean;
    await act(async () => {
      ok = await result.current.addRule({ name: 'R', description: 'd' });
    });
    expect(ok).toBe(false);
  });

  it('addRule creates and refreshes the list', async () => {
    mockCreate.mockResolvedValue({ status: 201, data: { id: 1 } });
    mockCustomInstance.mockResolvedValue({
      status: 200,
      data: { rules: [{ id: '1', name: 'New', description: 'd' }], total: 1 },
    });
    const { result } = renderHook(() => useRules(), { wrapper });

    let ok!: boolean;
    await act(async () => {
      ok = await result.current.addRule({ name: 'New', description: 'd' });
    });
    expect(ok).toBe(true);
    expect(mockCreate).toHaveBeenCalled();
  });

  it('updateRule returns false without a token or with a non-numeric id', async () => {
    window.localStorage.removeItem('auth_token');
    const { result } = renderHook(() => useRules(), { wrapper });

    let ok!: boolean;
    await act(async () => {
      ok = await result.current.updateRule('abc', { name: 'x' });
    });
    expect(ok).toBe(false);

    window.localStorage.setItem('auth_token', 'token-123');
    await act(async () => {
      ok = await result.current.updateRule('abc', { name: 'x' });
    });
    expect(ok).toBe(false);
  });

  it('updateRule updates and refreshes', async () => {
    mockUpdate.mockResolvedValue({ status: 200, data: {} });
    mockCustomInstance.mockResolvedValue({
      status: 200,
      data: { rules: [], total: 0 },
    });
    const { result } = renderHook(() => useRules(), { wrapper });

    let ok!: boolean;
    await act(async () => {
      ok = await result.current.updateRule('5', { name: 'x' });
    });
    expect(ok).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(5, { name: 'x' });
  });

  it('deleteRule returns false without a token or with a non-numeric id', async () => {
    window.localStorage.removeItem('auth_token');
    const { result } = renderHook(() => useRules(), { wrapper });

    let ok!: boolean;
    await act(async () => {
      ok = await result.current.deleteRule('abc');
    });
    expect(ok).toBe(false);

    window.localStorage.setItem('auth_token', 'token-123');
    await act(async () => {
      ok = await result.current.deleteRule('abc');
    });
    expect(ok).toBe(false);
  });

  it('deleteRule removes and refreshes', async () => {
    mockRemove.mockResolvedValue({ status: 200, data: {} });
    mockCustomInstance.mockResolvedValue({
      status: 200,
      data: { rules: [], total: 0 },
    });
    const { result } = renderHook(() => useRules(), { wrapper });

    let ok!: boolean;
    await act(async () => {
      ok = await result.current.deleteRule('5');
    });
    expect(ok).toBe(true);
    expect(mockRemove).toHaveBeenCalledWith(5);
  });

  it('throws when useRules is used outside the provider', () => {
    // Silence the expected error output
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useRules())).toThrow(
      'useRules must be used within a RulesProvider'
    );
    spy.mockRestore();
  });

  it('manages selectedRule state', async () => {
    const { result } = renderHook(() => useRules(), { wrapper });

    act(() => {
      result.current.setSelectedRule({ id: '1', name: 'x', description: '' });
    });
    expect(result.current.selectedRule?.id).toBe('1');
  });
});
