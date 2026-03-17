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

function expectValidationErrorResponse(res: { status: number; data?: any }) {
  expect(res.status).toBe(400);

  const data = res.data;
  const message = typeof data?.message === 'string' ? data.message : null;
  const hasValidationMessage =
    message === 'Validation failed' ||
    (typeof message === 'string' && message.toLowerCase().includes('validation'));

  expect(hasValidationMessage).toBe(true);
  expect(Array.isArray(data?.errors)).toBe(true);
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
    });

    it('should return 400 for missing required fields', async () => {
      const res = await axios.post(
        `/api/v1/users`,
        {
          email: 'user-missing-fields@example.com',
        },
        { validateStatus: () => true }
      );

      expectValidationErrorResponse(res);
    });
  });

  describe('rules', () => {
    it('should return 400 for invalid rule payload', async () => {
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
    });
  });

  describe('rules-settings', () => {
    it('should return 400 for missing required fields', async () => {
      const token = await loginAsAdmin();

      const res = await axios.post(
        `/api/v1/rules-settings`,
        {
          name: 'ab',
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
    });
  });

  describe('tags', () => {
    it('should return 400 for invalid tag name', async () => {
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
    });
  });
});
