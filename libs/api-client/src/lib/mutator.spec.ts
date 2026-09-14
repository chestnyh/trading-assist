import { CSRF_HEADER, customInstance } from './mutator';

const jsonResponse = (status: number, data: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
  }) as unknown as Response;

const lastCall = () => (global.fetch as jest.Mock).mock.calls;

describe('customInstance (auth mutator)', () => {
  beforeEach(() => {
    process.env['API_BASE_URL'] = 'http://api.test';
    (global as unknown as { document: unknown }).document = {
      cookie: 'csrf_token=csrf-value',
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete (global as unknown as { document?: unknown }).document;
  });

  it('sends cookies and never attaches an Authorization header (FR-001/FR-002/FR-008)', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(200, { rules: [], total: 0 }));

    await customInstance('/api/v1/rules?page=1&limit=20', { method: 'GET' });

    const [, options] = lastCall()[0];
    expect(options.credentials).toBe('include');
    expect(options.headers.Authorization).toBeUndefined();
  });

  it('echoes the CSRF cookie on state-changing requests (FR-010)', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(200, { success: true }));

    await customInstance('/api/v1/auth/logout', { method: 'POST' });

    const [, options] = lastCall()[0];
    expect(options.headers[CSRF_HEADER]).toBe('csrf-value');
  });

  it('does not add the CSRF header on safe methods (FR-012)', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(200, { id: 1 }));

    await customInstance('/api/v1/auth/me', { method: 'GET' });

    const [, options] = lastCall()[0];
    expect(options.headers[CSRF_HEADER]).toBeUndefined();
  });

  it('renews on 401 and retries the original request once (SC-012)', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, { statusCode: 401 }))
      .mockResolvedValueOnce(jsonResponse(200, {}))
      .mockResolvedValueOnce(jsonResponse(200, { rules: [], total: 0 }));

    const result = await customInstance('/api/v1/rules?page=1&limit=20', { method: 'GET' });

    expect(result).toMatchObject({ status: 200 });
    expect(lastCall()).toHaveLength(3);
    expect(String(lastCall()[1][0])).toContain('/api/v1/auth/refresh');
  });

  it('never attempts renewal for /auth/me, /auth/login or /auth/refresh (no loops)', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(401, { statusCode: 401 }));

    await expect(customInstance('/api/v1/auth/me', { method: 'GET' })).rejects.toMatchObject({
      status: 401,
    });

    expect(lastCall()).toHaveLength(1);
  });

  it('surfaces the 401 when the renewal itself fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, { statusCode: 401 }))
      .mockResolvedValueOnce(jsonResponse(401, { statusCode: 401 }));

    await expect(
      customInstance('/api/v1/rules?page=1&limit=20', { method: 'GET' })
    ).rejects.toMatchObject({ status: 401 });

    expect(lastCall()).toHaveLength(2);
  });
});
