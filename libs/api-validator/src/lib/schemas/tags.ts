import { z } from 'zod';
import { createSchemaValidator } from '../core';

export const CreateTagDtoSchema = z.object({
  name: z.string().min(2).max(20),
});

export const TagResponseDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  userId: z.number().int(),
});

export const CreateTagDtoSchemaValidator = createSchemaValidator(CreateTagDtoSchema);
