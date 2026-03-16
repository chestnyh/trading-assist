import { z } from 'zod';
import { createSchemaValidator } from '../core';

export const ExternalServiceResponseDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  userId: z.number().int(),
  fieldsSchema: z.array(z.unknown()),
});

export const ExternalServiceResponseDtoSchemaValidator = createSchemaValidator(ExternalServiceResponseDtoSchema);
