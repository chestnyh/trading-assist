import axios from 'axios';

async function loginAsAdmin(): Promise<string> {
  const res = await axios.post(
    `/api/v1/auth/login`,
    {
      email: 'admin@tb.com',
      password: 'Password123!',
      rememberMe: false,
    },
    { validateStatus: () => true }
  );

  expect(res.status).toBe(200);
  expect(typeof res.data?.access_token).toBe('string');
  return res.data.access_token as string;
}

type ValidationErrorResponse = { status: number; data?: any };

function expectValidationErrorResponse(res: ValidationErrorResponse) {
  expect(res.status).toBe(400);

  const data = res.data;
  const message = typeof data?.message === 'string' ? data.message : null;
  const hasValidationMessage =
    message === 'Validation failed' ||
    (typeof message === 'string' && message.toLowerCase().includes('validation'));

  expect(hasValidationMessage).toBe(true);
  expect(Array.isArray(data?.errors)).toBe(true);
}

function expectIssueForPath(
  res: ValidationErrorResponse,
  path: string,
  opts?: { messageIncludes?: string }
) {
  const errors = Array.isArray(res.data?.errors) ? (res.data.errors as any[]) : [];
  const issuesForPath = errors.filter((e) => Array.isArray(e?.path) && e.path[0] === path);

  expect(issuesForPath.length).toBeGreaterThan(0);

  if (opts?.messageIncludes) {
    const hasMatchingMessage = issuesForPath.some(
      (e) => typeof e?.message === 'string' && e.message.includes(opts.messageIncludes)
    );
    expect(hasMatchingMessage).toBe(true);
  }
}

describe('Schema validation', () => {
  describe('users', () => {
    it('should return 400 for invalid email', async () => {
      const res = await axios.post(
        `/api/v1/users`,
        {
          nickname: 'user-invalid-email',
          email: 'not-an-email',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
        },
        { validateStatus: () => true }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'email', { messageIncludes: 'valid email' });
    });

    it('should return 400 for missing required fields', async () => {
      const res = await axios.post(
        `/api/v1/users`,
        {},
        { validateStatus: () => true }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'nickname');
      expectIssueForPath(res, 'email');
      expectIssueForPath(res, 'password');
      expectIssueForPath(res, 'firstName');
      expectIssueForPath(res, 'lastName');
    });
  });

  describe('rules', () => {
    it('should return 400 for invalid rule payload (wrong format)', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/rules`,
        {
          name: 'a',
          description: 'short',
          ruleBody: 'not-an-object',
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'name');
      expectIssueForPath(res, 'description');
      expectIssueForPath(res, 'ruleBody');
    });

    it('should return 400 for missing required fields', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/rules`,
        {},
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'name');
      expectIssueForPath(res, 'description');
      expectIssueForPath(res, 'ruleBody');
    });
  });

  describe('rules-settings', () => {
    it('should return 400 for missing required fields', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/rules-settings`,
        {},
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'name');
      expectIssueForPath(res, 'code');
      expectIssueForPath(res, 'externalServiceId');
      expectIssueForPath(res, 'configuration');
    });

    it('should return 400 for invalid field formats', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/rules-settings`,
        {
          name: 'abc',
          code: 'x',
          externalServiceId: 'not-a-number',
          configuration: 'not-an-object',
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'externalServiceId');
      expectIssueForPath(res, 'configuration');
    });
  });

  describe('tags', () => {
    it('should return 400 for missing required fields', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/tags`,
        {},
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'name');
    });

    it('should return 400 for invalid tag name format', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/tags`,
        {
          name: 'a',
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expectValidationErrorResponse(res);
      expectIssueForPath(res, 'name');
    });
  });
});
