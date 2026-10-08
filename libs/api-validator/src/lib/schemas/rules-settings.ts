import { z } from 'zod';
import { createSchemaValidator } from '../core';
import { ServiceCodeSchema } from '../enum/service-code';

export const CreateUserRuleSettingDtoSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(1),
  description: z.string().optional(),
  serviceCode: ServiceCodeSchema,
  tags: z.array(z.string()).optional(),
  configuration: z.record(z.string(), z.unknown()),
});

export const UpdateUserRuleSettingDtoSchema = CreateUserRuleSettingDtoSchema.partial();

export const CreateUserRuleSettingDtoSchemaValidator = createSchemaValidator(CreateUserRuleSettingDtoSchema);
export const UpdateUserRuleSettingDtoSchemaValidator = createSchemaValidator(UpdateUserRuleSettingDtoSchema);