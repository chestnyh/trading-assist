import { z } from 'zod';
import { createSchemaValidator } from '../api-validator';

export const CreateUserRuleSettingDtoSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(1),
  description: z.string().min(10).optional(),
  externalServiceId: z.number().int(),
  tags: z.array(z.string()).optional(),
  configuration: z.record(z.string(), z.unknown()),
});

export const UpdateUserRuleSettingDtoSchema = CreateUserRuleSettingDtoSchema.partial();

export const RuleSettingResponseDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  configuration: z.unknown(),
  authorId: z.number().int(),
  externalServiceId: z.number().int(),
  tags: z.array(z.string()).optional(),
});

export const CreateUserRuleSettingDtoSchemaValidator = createSchemaValidator(CreateUserRuleSettingDtoSchema);
export const UpdateUserRuleSettingDtoSchemaValidator = createSchemaValidator(UpdateUserRuleSettingDtoSchema);
