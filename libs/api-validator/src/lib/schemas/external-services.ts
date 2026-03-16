import { z } from 'zod';
import { createSchemaValidator } from '../api-validator';

export const ExternalServiceResponseDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
  logoUrl: z.string().nullable(),
  fieldsSchema: z.array(z.unknown()),
});

export const ExternalServiceResponseDtoSchemaValidator = createSchemaValidator(ExternalServiceResponseDtoSchema);
