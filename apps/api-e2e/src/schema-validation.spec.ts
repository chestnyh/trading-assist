import axios from 'axios';

async function loginAsAdmin(): Promise<string> {
  const res = await axios.post(
    `/api/v1/auth/login`,
    {
      email: 'admin@tb.com',
      password: 'Password123!',
      rememberMe: false,
    },
  );

  expect(res.status).toBe(200);
  expect(typeof res.data?.access_token).toBe('string');
  return res.data.access_token as string;
}

type ValidationErrorResponse = { status: number; data?: any };

function expect400StatusAndDataTopStructure(res: ValidationErrorResponse) {
  expect(res.status).toBe(400);
  expect(res.data).toMatchObject({
    message: 'Validation failed',
    errors: expect.any(Array),
  });
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
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['email'],
            message: expect.stringContaining('valid email'),
          }),
        ]),
      });
    });

    it('should return 400 for missing required fields', async () => {
      const res = await axios.post(`/api/v1/users`, {});

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({ path: ['nickname'] }),
          expect.objectContaining({ path: ['email'] }),
          expect.objectContaining({ path: ['password'] }),
          expect.objectContaining({ path: ['firstName'] }),
          expect.objectContaining({ path: ['lastName'] }),
        ]),
      });
    });
  });

  describe('rules', () => {
    let token: string;

    beforeEach(async () => {
      token = await loginAsAdmin();
    });

    it('should return 400 for invalid rule payload (wrong format)', async () => {
      const res = await axios.post(
        `/api/v1/rules`,
        {
          name: 'a',
          description: 'short',
          ruleBody: 'not-an-object',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({ path: ['name'] }),
          expect.objectContaining({ path: ['description'] }),
          expect.objectContaining({ path: ['ruleBody'] }),
        ]),
      });
    });

    it('should return 400 for missing required fields', async () => {
      const res = await axios.post(
        `/api/v1/rules`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({ path: ['name'] }),
          expect.objectContaining({ path: ['description'] }),
          expect.objectContaining({ path: ['ruleBody'] }),
        ]),
      });
    });
  });

  describe('rules-settings', () => {
    let token: string;

    beforeEach(async () => {
      token = await loginAsAdmin();
    });

    it('should return 400 for missing required fields', async () => {
      const res = await axios.post(
        `/api/v1/rules-settings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({ path: ['name'] }),
          expect.objectContaining({ path: ['code'] }),
          expect.objectContaining({ path: ['externalServiceId'] }),
          expect.objectContaining({ path: ['configuration'] }),
        ]),
      });
    });

    it('should return 400 for invalid field formats', async () => {
      const res = await axios.post(
        `/api/v1/rules-settings`,
        {
          name: 'abc',
          code: 'x',
          externalServiceId: 'not-a-number',
          configuration: 'not-an-object',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({ path: ['serviceCode'] }),
          expect.objectContaining({ path: ['configuration'] }),
        ]),
      });
    });
  });

  describe('tags', () => {
    let token: string;

    beforeEach(async () => {
      token = await loginAsAdmin();
    });

    it('should return 400 for missing required fields', async () => {
      const res = await axios.post(
        `/api/v1/tags`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([expect.objectContaining({ path: ['name'] })]),
      });
    });

    it('should return 400 for invalid tag name format', async () => {
      const res = await axios.post(
        `/api/v1/tags`,
        {
          name: 'a',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect400StatusAndDataTopStructure(res);
      expect(res.data).toMatchObject({
        errors: expect.arrayContaining([expect.objectContaining({ path: ['name'] })]),
      });
    });
  });
});
