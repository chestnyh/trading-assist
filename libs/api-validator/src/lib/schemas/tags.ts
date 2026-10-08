import { z } from 'zod';
import { createSchemaValidator } from '../core';

export const CreateTagDtoSchema = z.object({
  name: z.string().min(2).max(20),
});

export const CreateTagDtoSchemaValidator = createSchemaValidator(CreateTagDtoSchema);
