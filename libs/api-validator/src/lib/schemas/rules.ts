import { z } from 'zod';
import { createSchemaValidator } from '../core';
import { RuleBodySchema } from './rule-body';

const CreateRuleDtoSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  ruleBody: RuleBodySchema,
});

const UpdateRuleDtoSchema = CreateRuleDtoSchema.partial();

export const CreateRuleDtoSchemaValidator = createSchemaValidator(CreateRuleDtoSchema);
export const UpdateRuleDtoSchemaValidator = createSchemaValidator(UpdateRuleDtoSchema);
