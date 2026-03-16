import { z } from 'zod';
import { createSchemaValidator, getSchemaValidator, Validate } from './api-validator';

describe('api-validator', () => {
  it('createSchemaValidator should keep schema reference', () => {
    const schema = z.object({ foo: z.string() });
    const validator = createSchemaValidator(schema);
    expect(validator.schema).toBe(schema);
  });

  it('Validate decorator should attach schema validator metadata to class', () => {
    const schema = z.object({ foo: z.string() });
    const validator = createSchemaValidator(schema);

    @Validate(validator)
    class TestDto {}

    expect(getSchemaValidator(TestDto)).toBe(validator);
  });
});
