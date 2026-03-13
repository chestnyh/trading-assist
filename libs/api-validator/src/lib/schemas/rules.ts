import { z } from 'zod';
import { createSchemaValidator } from '../api-validator';

export const CreateRuleDtoSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  ruleBody: z.record(z.string(), z.unknown()),
});

export const UpdateRuleDtoSchema = CreateRuleDtoSchema.partial();

export const RuleResponseDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  ruleBody: z.unknown(),
  authorId: z.number().int(),
});

export const PaginatedRulesDtoSchema = z.object({
  rules: z.array(RuleResponseDtoSchema),
  total: z.number().int(),
});

export const CreateRuleDtoSchemaValidator = createSchemaValidator(CreateRuleDtoSchema);
export const UpdateRuleDtoSchemaValidator = createSchemaValidator(UpdateRuleDtoSchema);
